package modelsdb

import (
	"gorm.io/gorm"
)

type WatchedEpisode struct {
	gorm.Model
	UserID    uint `gorm:"index:idx_watched_ep_uni,unique"`
	EpisodeID uint `gorm:"index:idx_watched_ep_uni,unique"`
	Episode   Episode
}
