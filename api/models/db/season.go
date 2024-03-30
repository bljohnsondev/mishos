package modelsdb

import (
	"time"

	"gorm.io/gorm"
)

type Season struct {
	gorm.Model
	ProviderID   *string `json:"providerId"`
	Number       uint8 `json:"number" gorm:"not null"`
	Premiered    *time.Time `json:"premiered"`
	Ended        *time.Time `json:"ended"`
	Network      *string `json:"network"`
	EpisodeOrder *uint16 `json:"episodeOrder"`
	ShowID       uint `json:"showId"`
	Episodes     []Episode `json:"episodes"`
}
