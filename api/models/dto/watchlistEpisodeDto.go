package modelsdto

import "time"

type WatchlistEpisodeDto struct {
	ID           uint64     `json:"id"`
	Name         string     `json:"name"`
	Summary      string     `json:"summary"`
	Number       uint       `json:"number"`
	Aired        *time.Time `json:"aired"`
	Runtime      *uint      `json:"runtime"`
	ShowID       uint64     `json:"showId"`
	ShowName     string     `json:"showName"`
	ImageMedium  string     `json:"imageMedium"`
	Network      string     `json:"network"`
	SeasonNumber uint       `json:"seasonNumber"`
	WatchDate    *time.Time `json:"watchedDate"`
}
