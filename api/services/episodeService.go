package services

import (
	"fmt"

	"mishosapi/db"
	modelsdb "mishosapi/models/db"

	"gorm.io/gorm"
)

type EpisodeService struct{}

func (es EpisodeService) Watch(userId uint, episodeId uint) (watched bool, err error) {
	count := int64(0)
	if err := db.DB.Model(&modelsdb.WatchedEpisode{}).Where("user_id = ? AND episode_id = ?", userId, episodeId).Count(&count).Error; err != nil {
		return false, err
	}

	if count > 0 {
		return false, nil
	}

	if err := db.DB.Model(&modelsdb.Episode{}).Where("id = ?", episodeId).Count(&count).Error; err != nil {
		return false, err
	}

	if count == 0 {
		return false, fmt.Errorf("episode not found: %d", episodeId)
	}

	watchedEpisode := modelsdb.WatchedEpisode{
		UserID:    userId,
		EpisodeID: episodeId,
	}

	if err := db.DB.Create(&watchedEpisode).Error; err != nil {
		return false, err
	}

	return true, nil
}

func (es EpisodeService) WatchPrevious(userId uint, episodeId uint) (episodesWatched int, err error) {
	var episode modelsdb.Episode
	if err := db.DB.Preload("Season").First(&episode, episodeId).Error; err != nil {
		return 0, err
	}

	type PreviousEpisode struct {
		EpisodeID     uint
		EpisodeNumber uint
		SeasonNumber  uint
	}

	// determine the users watched episodes first
	var watchedIds []int

	err = db.DB.
		Model(&modelsdb.WatchedEpisode{}).
		Select("episode_id").
		Joins("left join episodes on episodes.id = episode_id left join seasons on seasons.id = episodes.season_id left join shows on shows.id = seasons.show_id").
		Where("user_id = ? AND shows.id = ?", userId, episode.Season.ShowID).
		Scan(&watchedIds).
		Error

	if err != nil {
		return 0, err
	}

	if watchedIds == nil {
		// gorm or mysql or something converts an empty array to "NULL" which doesnt work as expected with "NOT IN"
		// so use an array with an impossible value
		watchedIds = []int{-1}
	}

	// now get any episodes for this show not in the watch list
	var previousEpisodes []PreviousEpisode

	err = db.DB.
		Model(&modelsdb.Episode{}).
		Select("episodes.id as EpisodeID, episodes.number as EpisodeNumber, seasons.Number as SeasonNumber").
		Joins("left join seasons on seasons.id = episodes.season_id left join shows on shows.id = seasons.show_id").
		Where("shows.id = ? AND episodes.id NOT IN ? AND (seasons.number < ? OR (seasons.number = ? AND episodes.Number <= ?))", episode.Season.ShowID, watchedIds, episode.Season.Number, episode.Season.Number, episode.Number).
		Order("seasons.number asc, episodes.number asc").
		Scan(&previousEpisodes).
		Error

	if err != nil {
		return 0, err
	}

	// now insert WatchedEpisode records in a transaction
	err = db.DB.Transaction(func(tx *gorm.DB) error {
		for _, episode := range previousEpisodes {
			newWatched := modelsdb.WatchedEpisode{
				UserID:    userId,
				EpisodeID: episode.EpisodeID,
			}

			if err := tx.Create(&newWatched).Error; err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		return 0, err
	}

	return len(previousEpisodes), nil
}

func (es EpisodeService) Unwatch(userId uint, episodeId uint) error {
	if err := db.DB.Where("user_id = ? AND episode_id = ?", userId, episodeId).Unscoped().Delete(&modelsdb.WatchedEpisode{}).Error; err != nil {
		return err
	}

	return nil
}
