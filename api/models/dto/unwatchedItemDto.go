package modelsdto

type UnwatchedItemDto struct {
	ShowID             uint64 `json:"showId"`
	ShowName           string `json:"showName"`
	ImageMedium        string `json:"imageMedium"`
	EpisodeID          uint64 `json:"episodeId"`
	EpisodeName        string `json:"episodeName"`
	EpisodeDescription string `json:"episodeDescription"`
	SeasonNumber       uint   `json:"seasonNumber"`
	EpisodeNumber      uint   `json:"episodeNumber"`
	Network            string `json:"network"`
}
