package services

import (
	"slices"
	"time"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"

	"mishosapi/apphooks"
	"mishosapi/config"
	"mishosapi/db"
	modelsdb "mishosapi/models/db"
	modelsdto "mishosapi/models/dto"
	"mishosapi/tvproviders"
)

type ShowService struct{}

func (showService ShowService) FindByProviderId(providerId string, show *modelsdb.Show) error {
	result := db.DB.Where("provider_id = ?", providerId).First(show)
	return result.Error
}

func (showService ShowService) IsFollowed(userId uint, showId uint) (bool, error) {
	count := int64(0)

	if result := db.DB.Model(&modelsdb.FollowedShow{}).Where("user_id = ? AND show_id = ?", userId, showId).Count(&count); result.Error != nil {
		return false, result.Error
	}

	return count > 0, nil
}

func (showService ShowService) FindFollowed(userId uint, followedShows *[]modelsdto.FollowedShowDto) error {
	err := db.DB.
		Model(&modelsdb.FollowedShow{}).
		Select(`
			followed_shows.id as FollowedShowID,
		  followed_shows.user_id as UserID,
		  followed_shows.show_id as ShowID,
		  shows.name as ShowName,
		  shows.network as Network,
		  shows.image_medium as ImageMedium,
			shows.status as Status
		`).
		Joins("left join shows on shows.id = followed_shows.show_id").
		Where("followed_shows.user_id = ?", userId).
		Order("shows.name asc").
		Scan(followedShows).
		Error

	return err
}

func (showService ShowService) Follow(userId uint, showId uint) error {
	followed, err := showService.IsFollowed(userId, showId)
	if err != nil {
		return err
	}

	if !followed {
		followedShow := modelsdb.FollowedShow{
			UserID: userId,
			ShowID: showId,
		}
		db.DB.Create(&followedShow)

		// update any notifier tasks
		payload := apphooks.FollowPayload{
			UserID:   userId,
			ShowID:   showId,
			Followed: true,
		}

		apphooks.OnFollow.Dispatch(payload)
	}

	return nil
}

func (showService ShowService) Unfollow(userId uint, showId uint) error {
	followed, err := showService.IsFollowed(userId, showId)
	if err != nil {
		return err
	}

	if followed {
		if err := db.DB.Where("user_id = ? AND show_id = ?", userId, showId).Unscoped().Delete(&modelsdb.FollowedShow{}).Error; err != nil {
			return err
		}

		// update any notifier tasks
		payload := apphooks.FollowPayload{
			UserID:   userId,
			ShowID:   showId,
			Followed: false,
		}

		apphooks.OnUnfollow.Dispatch(payload)
	}

	return nil
}

func (showService ShowService) CreateShow(providerId string, show *modelsdb.Show) (added bool, err error) {
	providerClient := tvproviders.ProviderClient{}

	var shows []modelsdb.Show

	if result := db.DB.Where("provider_id = ?", providerId).Find(&shows).Limit(1); result.Error != nil {
		return false, result.Error
	}

	// create the show if it wasnt found
	if len(shows) == 0 {
		if err := providerClient.GetShow(providerId, show); err != nil {
			return false, err
		}

		result := db.DB.Create(show)
		if result.Error != nil {
			return false, result.Error
		}

		return true, nil
	} else {
		// assign the loaded show to the show pointer param
		// TODO: if the show was found then run DownloadShow to do a show "refresh" to update the data from the provider
		*show = shows[0]
		return false, nil
	}
}

func (showService ShowService) SearchShow(userId uint, query string, results *[]modelsdto.ShowSearchResultDto) error {
	providerClient := tvproviders.ProviderClient{}

	if err := providerClient.SearchShows(query, results); err != nil {
		return err
	}

	// if show has been added then add the ID
	for i, searchResult := range *results {
		var showIds []uint

		err := db.DB.
			Model(&modelsdb.Show{}).
			Select("id").
			Where("provider_id = ?", searchResult.ProviderID).
			Scan(&showIds).
			Error

		if err != nil {
			return err
		}

		if len(showIds) > 0 {
			searchResult.ShowID = &showIds[0]

			followingCount := int64(0)

			// if the show is saved check if the user is following
			err = db.DB.
				Model(&modelsdb.FollowedShow{}).
				Where("user_id = ? AND show_id = ?", userId, searchResult.ShowID).
				Count(&followingCount).
				Error

			if err != nil {
				return err
			}

			following := followingCount > 0
			searchResult.Following = &following

			// due to how go works you have to reassign the changed value to the slice
			(*results)[i] = searchResult
		}
	}

	return nil
}

func (showService ShowService) PreviewShow(providerId string, show *modelsdb.Show) error {
	providerClient := tvproviders.ProviderClient{}

	if err := providerClient.GetShow(providerId, show); err != nil {
		return err
	}

	return nil
}

func (showService ShowService) IsEpisodeWatched(userId uint, episodeId uint) (watched bool, err error) {
	var watchedEpisodes []modelsdb.WatchedEpisode

	if err := db.DB.Where("user_id = ? AND episode_id = ?", userId, episodeId).Find(&watchedEpisodes).Error; err != nil {
		return false, err
	}

	return (len(watchedEpisodes) > 0), nil
}

func (showService ShowService) GetWatchedEpisodeIds(userId uint, showId uint64, watchedIds *[]uint) error {
	err := db.DB.
		Model(&modelsdb.WatchedEpisode{}).
		Select("episodes.id").
		Joins("left join episodes on episodes.id = watched_episodes.episode_id left join seasons on seasons.id = episodes.season_id left join shows s on s.id = seasons.show_id").
		Where("user_id = ? AND s.id = ?", userId, showId).
		Find(&watchedIds).
		Error

	if err != nil {
		return err
	}

	return nil
}

func (showService ShowService) GetShow(userId uint, showId uint64) (show *modelsdb.Show, err error) {
	var shows []modelsdb.Show
	if err := db.DB.Preload("Seasons", func(db *gorm.DB) *gorm.DB {
		// this is to handle ordering of preloaded joins
		return db.Order("seasons.number ASC")
	}).Preload("Seasons.Episodes", func(db *gorm.DB) *gorm.DB {
		return db.Order("episodes.number ASC")
	}).Limit(1).Find(&shows, showId).Error; err != nil {
		return nil, err
	}

	if len(shows) > 0 {
		show := shows[0]

		var watchedIds []uint

		airedCount := 0

		err := showService.GetWatchedEpisodeIds(userId, showId, &watchedIds)
		if err != nil {
			return nil, err
		}

		// loop through all the episodes to determine the users watched status
		for _, season := range show.Seasons {
			for episodeIndex, episode := range season.Episodes {
				seasonNumber := season.Number
				episode.SeasonNumber = &seasonNumber
				episode.Watched = slices.Contains(watchedIds, episode.ID)
				season.Episodes[episodeIndex] = episode

				if episode.Aired.Before(time.Now()) {
					airedCount += 1
				}
			}
		}

		completed := int(float32(len(watchedIds)) / float32(airedCount) * 100)
		show.Completed = &completed

		return &show, nil
	} else {
		return nil, nil
	}
}

func (showService ShowService) RefreshShow(showId uint64) error {
	var show modelsdb.Show
	if err := db.DB.Preload("Seasons").Preload("Seasons.Episodes").First(&show, showId).Error; err != nil {
		return err
	}

	providerClient := tvproviders.ProviderClient{}

	var providerShow modelsdb.Show

	if err := providerClient.GetShow(*show.ProviderID, &providerShow); err != nil {
		return err
	}

	providerClient.CopyShowData(providerShow, &show)

	deletedEpisodes := []modelsdb.Episode{}

	// compare seasons/episodes of the existing show to the current provider show
	for seasonIndex, season := range show.Seasons {
		_, providerSeason := findSeasonByNumber(providerShow, season.Number)

		if providerSeason != nil {
			// update existing season data
			providerClient.CopySeasonData(*providerSeason, &season)
			show.Seasons[seasonIndex] = season
		}

		for epIndex, episode := range season.Episodes {
			if episode.Number != nil {
				if providerSeason != nil {
					_, providerEpisode := findEpisodeByNumber(*providerSeason, *episode.Number)

					if providerEpisode != nil {
						// update existing episode data
						providerClient.CopyEpisodeData(*providerEpisode, &episode)
						season.Episodes[epIndex] = episode
					}
				}

				// check for any episodes that have been removed from the provider list
				if !episodeExists(providerShow, season.Number, *episode.Number) {
					deletedEpisodes = append(deletedEpisodes, episode)
				}
			}
		}
	}

	// now loop through data in the provider show to compare to existing
	for _, providerSeason := range providerShow.Seasons {
		seasonIndex, season := findSeasonByNumber(show, providerSeason.Number)

		if season == nil {
			// if an entire season is missing add it and all episodes as new
			show.Seasons = append(show.Seasons, providerSeason)
		} else {
			added := false

			for _, providerEpisode := range providerSeason.Episodes {
				if providerEpisode.Number != nil {
					_, episode := findEpisodeByNumber(*season, *providerEpisode.Number)

					if episode == nil {
						// add the new episode
						season.Episodes = append(season.Episodes, providerEpisode)
						added = true
					}
				}
			}

			if added {
				show.Seasons[seasonIndex] = *season
			}
		}
	}

	err := db.DB.Transaction(func(tx *gorm.DB) error {
		// NOTE: need to include FullSaveAssociations so property changes on joined records (like season and episode) will be saved
		if err := tx.Session(&gorm.Session{FullSaveAssociations: true}).Save(&show).Error; err != nil {
			return err
		}

		// remove any deleted episode records and any watched ep records
		if len(deletedEpisodes) > 0 {
			// first delete any watched episode records
			var delepid []uint
			for _, delep := range deletedEpisodes {
				delepid = append(delepid, delep.ID)
			}

			tx.Unscoped().Where("episode_id in ?", delepid).Delete(&modelsdb.WatchedEpisode{})

			// now delete the episodes
			tx.Unscoped().Delete(deletedEpisodes)
		}

		return nil
	})

	if err != nil {
		return err
	}

	return nil
}

func (showService ShowService) RefreshAllShows() error {
	type ShowInfo struct {
		ID   uint64
		Name string
	}

	var shows []ShowInfo

	err := db.DB.
		Model(&modelsdb.Show{}).
		Select("shows.id, shows.name").
		Joins("inner join followed_shows fs on fs.show_id = shows.id").
		Group("shows.id").
		Scan(&shows).
		Error

	if err != nil {
		return err
	}

	for _, showInfo := range shows {
		if err := showService.RefreshShow(showInfo.ID); err != nil {
			log.Error().Err(err).Msgf("updating show failed [%d]: %s", showInfo.ID, showInfo.Name)
		} else {
			log.Info().Msgf("updated show [%d]: %s", showInfo.ID, showInfo.Name)
		}

		// sleep for 10 seconds to provide a rate limit for the external API calls
		time.Sleep(config.ProviderRateLimit)
	}

	return nil
}

func episodeExists(show modelsdb.Show, seasonNumber uint8, episodeNumber uint16) bool {
	for _, season := range show.Seasons {
		if season.Number == seasonNumber {
			for _, episode := range season.Episodes {
				if episode.Number != nil && *episode.Number == episodeNumber {
					return true
				}
			}
		}
	}

	return false
}

func findSeasonByNumber(show modelsdb.Show, seasonNumber uint8) (int, *modelsdb.Season) {
	for index, season := range show.Seasons {
		if season.Number == seasonNumber {
			return index, &season
		}
	}

	return 0, nil
}

func findEpisodeByNumber(season modelsdb.Season, epNumber uint16) (int, *modelsdb.Episode) {
	for index, episode := range season.Episodes {
		if episode.Number != nil && *episode.Number == epNumber {
			return index, &episode
		}
	}

	return 0, nil
}
