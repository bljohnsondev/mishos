package modelsdb

import (
	"time"
)

type Season struct {
	Model
	ProviderID   *string    `json:"providerId"`
	Number       uint8      `json:"number" gorm:"uniqueIndex:idx_season_uni;not null"`
	Premiered    *time.Time `json:"premiered"`
	Ended        *time.Time `json:"ended"`
	Network      *string    `json:"network"`
	EpisodeOrder *uint16    `json:"episodeOrder"`
	ShowID       uint       `json:"showId" gorm:"uniqueIndex:idx_season_uni"`
	Show         Show       `json:"-"`
	Episodes     []Episode  `json:"episodes"`
}
