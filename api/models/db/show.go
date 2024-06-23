package modelsdb

import (
	"time"
)

type Show struct {
	Model
	ProviderID    *string    `json:"providerId"`
	ProviderUrl   *string    `json:"providerUrl"`
	Name          string     `json:"name" gorm:"not null"`
	Summary       *string    `json:"summary" gorm:"type:text"`
	Language      *string    `json:"language"`
	Status        *string    `json:"status"`
	Runtime       *uint16    `json:"runtime"`
	Premiered     *time.Time `json:"premiered"`
	Ended         *time.Time `json:"ended"`
	OfficialSite  *string    `json:"officialSite"`
	Network       *string    `json:"network"`
	ImageMedium   *string    `json:"imageMedium"`
	ImageOriginal *string    `json:"imageOriginal"`
	ImdbId        *string    `json:"imdbId"`
	Seasons       []Season   `json:"seasons"`
	Completed     *int       `gorm:"-" json:"completed"`
}
