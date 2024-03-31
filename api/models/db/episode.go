package modelsdb

import (
	"time"
)

type Episode struct {
	Model
	ProviderID   *string          `json:"providerId"`
	Name         *string          `json:"name"`
	Number       *uint16          `json:"number"`
	Type         *string          `json:"type"`
	Aired        *time.Time       `json:"aired"`
	Runtime      *uint16          `json:"runtime"`
	Summary      *string          `json:"summary" gorm:"type:text"`
	SeasonID     uint             `json:"-"`
	Season       Season           `json:"-"`
	Watches      []WatchedEpisode `json:"-"`
	Watched      bool             `gorm:"-" json:"watched"`
	SeasonNumber *uint8           `gorm:"-" json:"seasonNumber"`
}
