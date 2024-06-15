package modelsdb

import (
	"time"
)

type WatchedEpisode struct {
	Model
	UserID    uint       `gorm:"index:idx_watched_ep_uni,unique" json:"userId"`
	EpisodeID uint       `gorm:"index:idx_watched_ep_uni,unique" json:"episodeId"`
	Episode   Episode    `json:"-"`
	WatchedAt *time.Time `json:"watchedAt"`
}
