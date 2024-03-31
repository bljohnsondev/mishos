package services

import (
	"os"
	"slices"
	"strconv"
	"time"

	"mishosapi/db"
	modelsdb "mishosapi/models/db"
	modelsdto "mishosapi/models/dto"
)

type WatchListService struct{}

func (ws WatchListService) GetUnwatched(userId uint) (*[]modelsdto.WatchlistEpisodeDto, error) {
	// get a list of the earliest unwatched episode of each followed show
	var unwatched = []modelsdto.WatchlistEpisodeDto{}
	err := db.DB.
		Model(&modelsdb.Show{}).
		Select(`
      shows.id as ShowID,
      shows.name as ShowName,
      shows.image_medium as ImageMedium,
      shows.network as Network,
      episodes.id as ID,
      episodes.number as Number,
      episodes.name as Name,
      episodes.summary as Summary,
      episodes.aired as Aired,
      episodes.runtime as Runtime,
      seasons.number as SeasonNumber
    `).
		Joins(`
      inner join seasons on seasons.show_id = shows.id
      inner join episodes on episodes.season_id = seasons.id
      inner join followed_shows on followed_shows.show_id = shows.id
      left join watched_episodes on watched_episodes.episode_id = episodes.id
    `).
		Where(`
      followed_shows.user_id = ?
      and watched_episodes.id is null
      and episodes.aired <= now()
    `, userId).
		Group("shows.id").
		Order("shows.name").
		Scan(&unwatched).
		Error

	if err != nil {
		return nil, err
	}

	// get a list of followed shows sorted by their last watched episode
	var lastWatchedShows []modelsdto.WatchedShowDto
	err = db.DB.
		Model(&modelsdb.Show{}).
		Select(`
      shows.id as ShowID,
      shows.name as ShowName,
      max(watched_episodes.created_at) as LastWatched
    `).
		Joins(`
      inner join seasons on seasons.show_id = shows.id
      inner join episodes on episodes.season_id = seasons.id
      inner join followed_shows on followed_shows.show_id = shows.id
      left join watched_episodes on watched_episodes.episode_id = episodes.id
    `).
		Where(`
      followed_shows.user_id = ?
      and watched_episodes.user_id = ?
    `, userId, userId).
		Group("shows.id").
		Scan(&lastWatchedShows).
		Error

	if err != nil {
		return nil, err
	}

	// sort the episodes based on when a show was last watched
	slices.SortFunc(unwatched, func(a, b modelsdto.WatchlistEpisodeDto) int {
		lastA := getLastWatched(a, lastWatchedShows)
		lastB := getLastWatched(b, lastWatchedShows)

		if lastA.Before(lastB) {
			return 1
		}

		if lastA.After(lastB) {
			return -1
		}

		return 0
	})

	return &unwatched, nil
}

func (ws WatchListService) GetRecent(userId uint) (*[]modelsdto.WatchlistEpisodeDto, error) {
	limit := 10

	limitString, ok := os.LookupEnv("WATCHLIST_RECENT_LIMIT")

	if ok {
		converted, err := strconv.ParseInt(limitString, 10, 32)
		if err == nil {
			limit = int(converted)
		}
	}

	var watched = []modelsdto.WatchlistEpisodeDto{}
	err := db.DB.
		Model(&modelsdb.Episode{}).
		Select(`
      episodes.id as ID,
      episodes.name as Name,
      episodes.number as Number,
      episodes.summary as Summary,
      episodes.aired as Aired,
      episodes.runtime as Runtime,
      seasons.number as SeasonNumber,
      watched_episodes.created_at as WatchDate,
      shows.id as ShowID,
      shows.name as ShowName,
      shows.image_medium as ImageMedium,
      shows.network as Network
    `).
		Joins(`
      inner join watched_episodes on watched_episodes.episode_id = episodes.id
      inner join seasons on seasons.id = episodes.season_id
      inner join shows on shows.id = seasons.show_id
    `).
		Where(`
		  watched_episodes.user_id = ?
    `, userId).
		Order("watched_episodes.created_at desc").
		Limit(limit).
		Scan(&watched).
		Error

	if err != nil {
		return nil, err
	}

	return &watched, nil
}

func (ws WatchListService) GetUpcoming(userId uint) (*[]modelsdto.WatchlistEpisodeDto, error) {
	/*
		SELECT
		e.id,
		e.number,
		e.name,
		e.aired,
		e.summary,
		e.runtime,
		se.number 'seasonNumber',
		s.name 'showName',
		s.network 'network',
		s.image_medium 'imageMedium'
		from episodes e
		inner join seasons se on se.id = e.season_id
		inner join shows s on s.id = se.show_id
		inner join followed_shows fs on fs.show_id = s.id
		where
		fs.user_id = 1
		and e.aired >= now()
		order by e.aired asc
	*/
	var upcoming = []modelsdto.WatchlistEpisodeDto{}
	err := db.DB.
		Model(&modelsdb.Episode{}).
		Select(`
      episodes.id as ID,
      episodes.name as Name,
      episodes.number as Number,
      episodes.summary as Summary,
      episodes.aired as Aired,
      episodes.runtime as Runtime,
      seasons.number as SeasonNumber,
      shows.id as ShowID,
      shows.name as ShowName,
      shows.image_medium as ImageMedium,
      shows.network as Network
    `).
		Joins(`
      inner join seasons on seasons.id = episodes.season_id
      inner join shows on shows.id = seasons.show_id
      inner join followed_shows on followed_shows.show_id = shows.id
    `).
		Where(`
		  followed_shows.user_id = ?
		  and episodes.aired >= ?
    `, userId, time.Now()).
		Order("episodes.aired asc").
		Scan(&upcoming).
		Error

	if err != nil {
		return nil, err
	}

	return &upcoming, nil
}

func getLastWatched(item modelsdto.WatchlistEpisodeDto, lastWatchedShows []modelsdto.WatchedShowDto) time.Time {
	var last time.Time
	for _, show := range lastWatchedShows {
		if show.ShowID == item.ShowID {
			last = show.LastWatched
		}
	}

	return last
}
