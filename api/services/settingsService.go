package services

import (
	"errors"
	"time"

	"github.com/rs/zerolog/log"
	"github.com/tidwall/gjson"

	"mishosapi/db"
	modelsdb "mishosapi/models/db"
	"mishosapi/utils"
)

type SettingsService struct{}

func (sets SettingsService) ImportFile(userId uint, json gjson.Result) error {
	showCount := int64(0)
	if err := db.DB.Model(&modelsdb.Show{}).Count(&showCount).Error; err != nil {
		return err
	}

	if showCount > 0 {
		return errors.New("aborting file import: shows already exist")
	}

	shows := json.Get("shows").Array()

	for _, showResult := range shows {
		show := sets.convertJsonToShow(showResult, userId)
		if show == nil {
			log.Error().Msgf("error converting show: %s", showResult.Get("name").String())
			continue
		}

		db.DB.Create(show)

		followedShow := modelsdb.FollowedShow{
			UserID: userId,
			ShowID: show.ID,
		}

		db.DB.Create(&followedShow)

		log.Debug().Msgf("imported new show [%d]: %s", show.ID, show.Name)
	}

	return nil
}

func (sets SettingsService) convertJsonToShow(showResult gjson.Result, userId uint) *modelsdb.Show {
	show := modelsdb.Show{
		ProviderID:    utils.StrPtr(showResult.Get("providerId").String()),
		Name:          showResult.Get("name").String(),
		ProviderUrl:   utils.StrPtr(showResult.Get("providerUrl").String()),
		Summary:       utils.StrPtr(showResult.Get("summary").String()),
		Language:      utils.StrPtr(showResult.Get("language").String()),
		Status:        utils.StrPtr(showResult.Get("status").String()),
		Runtime:       utils.ParseUint16Ptr(showResult.Get("runtime").String()),
		Premiered:     utils.ParseTimePtr(showResult.Get("premiered").String()),
		Ended:         utils.ParseTimePtr(showResult.Get("ended").String()),
		OfficialSite:  utils.StrPtr(showResult.Get("officialSite").String()),
		Network:       utils.StrPtr(showResult.Get("network").String()),
		ImageMedium:   utils.StrPtr(showResult.Get("imageMedium").String()),
		ImageOriginal: utils.StrPtr(showResult.Get("imageOriginal").String()),
		ImdbId:        utils.StrPtr(showResult.Get("imdbId").String()),
		Seasons:       []modelsdb.Season{},
	}

	seasonsResult := showResult.Get("seasons").Array()

	for _, seasonResult := range seasonsResult {
		season := modelsdb.Season{
			ProviderID:   utils.StrPtr(seasonResult.Get("providerId").String()),
			Number:       uint8(*utils.ParseUint16Ptr(seasonResult.Get("number").String())),
			Premiered:    utils.ParseTimePtr(seasonResult.Get("premiered").String()),
			Ended:        utils.ParseTimePtr(seasonResult.Get("ended").String()),
			Network:      utils.StrPtr(seasonResult.Get("network").String()),
			EpisodeOrder: utils.ParseUint16Ptr(showResult.Get("episodeOrder").String()),
			Episodes:     []modelsdb.Episode{},
		}

		episodesResult := seasonResult.Get("episodes").Array()

		for _, episodeResult := range episodesResult {
			episode := modelsdb.Episode{
				ProviderID: utils.StrPtr(episodeResult.Get("providerId").String()),
				Name:       utils.StrPtr(episodeResult.Get("name").String()),
				Number:     utils.ParseUint16Ptr(episodeResult.Get("number").String()),
				Type:       utils.StrPtr(episodeResult.Get("type").String()),
				Aired:      utils.ParseTimePtr(episodeResult.Get("aired").String()),
				Runtime:    utils.ParseUint16Ptr(episodeResult.Get("runtime").String()),
				Summary:    utils.StrPtr(episodeResult.Get("summary").String()),
			}

			watchedAtResult := episodeResult.Get("watches.0.createdAt")

			if watchedAtResult.Exists() {
				if watchedAt, err := time.Parse(time.RFC3339Nano, watchedAtResult.String()); err != nil {
					log.Warn().Msgf("found invalid createdAt for watched episode %s", episodeResult.Get("id").String())
				} else {
					episode.Watches = []modelsdb.WatchedEpisode{
						{
							UserID:    userId,
							WatchedAt: &watchedAt,
						},
					}
				}
			}

			season.Episodes = append(season.Episodes, episode)
		}

		show.Seasons = append(show.Seasons, season)
	}

	return &show
}
