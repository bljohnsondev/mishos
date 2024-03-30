package modelsdto

type ShowSearchResultDto struct {
	ShowID      *uint   `json:"showId"`
	ProviderID  string  `json:"providerId"`
	Name        *string `json:"name"`
	Network     *string `json:"network"`
	ImageMedium *string `json:"imageMedium"`
	Following   *bool   `json:"following"`
}
