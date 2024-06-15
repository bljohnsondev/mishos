package modelsdb

import (
	"time"
)

type Episode struct {
	Model
	ProviderID   *string          `json:"providerId"`
	Name         *string          `json:"name"`
	Number       *uint16          `json:"number" gorm:"uniqueIndex:idx_episode_uni"`
	Type         *string          `json:"type"`
	Aired        *time.Time       `json:"aired"`
	Runtime      *uint16          `json:"runtime"`
	Summary      *string          `json:"summary" gorm:"type:text"`
	SeasonID     uint             `json:"-" gorm:"uniqueIndex:idx_episode_uni"`
	Season       Season           `json:"-"`
	Watches      []WatchedEpisode `json:"watches"`
	Watched      bool             `gorm:"-" json:"watched"`
	SeasonNumber *uint8           `gorm:"-" json:"seasonNumber"`
}
