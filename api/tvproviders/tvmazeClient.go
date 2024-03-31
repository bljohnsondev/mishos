package tvproviders

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	modelsdb "mishosapi/models/db"
	modelsdto "mishosapi/models/dto"

	strip "github.com/grokify/html-strip-tags-go"
	"github.com/tidwall/gjson"
)

var urlPrefix = "https://api.tvmaze.com"

type ProviderClient struct{}

func (pc ProviderClient) GetShow(showId string, show *modelsdb.Show) error {
	body, err := pc.get(fmt.Sprintf("shows/%s", showId), nil)
	if err != nil {
		return err
	}

	json := gjson.Parse(body)

	show.ProviderID = StrPtr(json.Get("id").String())
	show.ProviderUrl = StrPtr(json.Get("url").String())
	show.Name = json.Get("name").String()
	show.Summary = StrPtr(strip.StripTags(json.Get("summary").String()))
	show.Language = StrPtr(json.Get("language").String())
	show.Status = StrPtr(json.Get("status").String())

	if json.Get("averageRuntime").Exists() {
		show.Runtime = Uint16Ptr(json.Get("averageRuntime").Uint())
	} else if json.Get("runtime").Exists() {
		show.Runtime = Uint16Ptr(json.Get("runtime").Uint())
	}

	show.Premiered = getJsonDatePtr(json, "premiered", "")
	show.Ended = getJsonDatePtr(json, "ended", "")
	show.OfficialSite = StrPtr(json.Get("officialSite").String())
	show.Network = getNetworkOrWebChannel(json)
	show.ImageMedium = StrPtr(json.Get("image.medium").String())
	show.ImageOriginal = StrPtr(json.Get("image.original").String())
	show.ImdbId = StrPtr(json.Get("externals.imdb").String())

	err = pc.GetSeasonsAndEpisodes(show)
	if err != nil {
		return err
	}

	return nil
}

func (pc ProviderClient) GetSeasonsAndEpisodes(show *modelsdb.Show) error {
	body, err := pc.get(fmt.Sprintf("shows/%s/seasons", *show.ProviderID), nil)
	if err != nil {
		return err
	}

	seasonsJson := gjson.Parse(body)

	body, err = pc.get(fmt.Sprintf("shows/%s/episodes", *show.ProviderID), nil)
	if err != nil {
		return err
	}

	episodesJson := gjson.Parse(body)

	seasons := []modelsdb.Season{}

	seasonsJson.ForEach(func(key, value gjson.Result) bool {
		seasonNumber := value.Get("number").Uint()

		season := &modelsdb.Season{}

		// if an existing season already exists update the values
		for _, existingSeason := range show.Seasons {
			if existingSeason.Number == uint8(seasonNumber) {
				season = &existingSeason
				break
			}
		}

		season.ProviderID = StrPtr(value.Get("id").String())
		season.Number = uint8(seasonNumber)
		season.Premiered = getJsonDatePtr(value, "premiereDate", "")
		season.Ended = getJsonDatePtr(value, "endDate", "")
		season.Network = getNetworkOrWebChannel(value)
		season.EpisodeOrder = Uint16Ptr(value.Get("number").Uint())

		filteredEpisodesJson := episodesJson.Get(fmt.Sprintf("#(season==%d)#", seasonNumber))

		episodes := []modelsdb.Episode{}

		filteredEpisodesJson.ForEach(func(episodeKey, episodeValue gjson.Result) bool {
			episodeNumber := uint16(episodeValue.Get("number").Uint())

			episode := &modelsdb.Episode{}

			// if an existing episode already exists update the values
			for _, existingEpisode := range season.Episodes {
				if *existingEpisode.Number == uint16(episodeNumber) {
					episode = &existingEpisode
					break
				}
			}

			episode.ProviderID = StrPtr(episodeValue.Get("id").String())
			episode.Name = StrPtr(episodeValue.Get("name").String())
			episode.Number = &episodeNumber
			episode.Type = StrPtr(episodeValue.Get("type").String())
			episode.Aired = getJsonDatePtr(episodeValue, "airstamp", time.RFC3339)
			episode.Runtime = Uint16Ptr(episodeValue.Get("runtime").Uint())
			episode.Summary = StrPtr(strip.StripTags(episodeValue.Get("summary").String()))
			episode.SeasonNumber = &season.Number

			episodes = append(episodes, *episode)

			return true
		})

		season.Episodes = episodes

		seasons = append(seasons, *season)

		return true
	})

	show.Seasons = seasons

	return nil
}

func (pc ProviderClient) SearchShows(query string, results *[]modelsdto.ShowSearchResultDto) error {
	params := url.Values{}
	params.Add("q", query)

	body, err := pc.get("search/shows", &params)
	if err != nil {
		return err
	}

	json := gjson.Parse(body)
	json.ForEach(func(key, value gjson.Result) bool {
		showJson := value.Get("show")

		result := modelsdto.ShowSearchResultDto{
			ProviderID:  showJson.Get("id").String(),
			Name:        StrPtr(showJson.Get("name").String()),
			Network:     getNetworkOrWebChannel(showJson),
			ImageMedium: StrPtr(showJson.Get("image.medium").String()),
		}

		*results = append(*results, result)
		return true
	})

	return nil
}

func StrPtr(str string) *string {
	return &str
}

func Uint16Ptr(num uint64) *uint16 {
	num16 := uint16(num)
	return &num16
}

func getNetworkOrWebChannel(json gjson.Result) *string {
	networkValue := json.Get("network.name")

	if networkValue.Exists() {
		return StrPtr(networkValue.String())
	} else {
		networkValue = json.Get("webChannel.name")
		if networkValue.Exists() {
			return StrPtr(networkValue.String())
		}
	}

	return nil
}

func getJsonDatePtr(json gjson.Result, key string, dateFormat string) *time.Time {
	if dateFormat == "" {
		dateFormat = time.DateOnly
	}

	dateValue := json.Get(key)

	if dateValue.Exists() {
		date, err := time.Parse(dateFormat, dateValue.String())
		if err == nil {
			return &date
		}
	}

	return nil
}

func (pc ProviderClient) get(uri string, params *url.Values) (string, error) {
	url := fmt.Sprintf("%s/%s", urlPrefix, uri)

	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}

	if params != nil {
		request.URL.RawQuery = params.Encode()
	}

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		wrapped := fmt.Errorf("%w", err)
		return "", errors.Unwrap(wrapped)
	}

	defer response.Body.Close()

	if response.StatusCode != 200 {
		return "", fmt.Errorf("received error from provider with code %d", response.StatusCode)
	}

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}
