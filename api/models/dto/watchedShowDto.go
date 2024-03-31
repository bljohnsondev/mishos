package modelsdto

import "time"

type WatchedShowDto struct {
	ShowID      uint64    `json:"showId"`
	ShowName    string    `json:"showName"`
	LastWatched time.Time `json:"lastWatched"`
}
