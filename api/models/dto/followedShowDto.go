package modelsdto

type FollowedShowDto struct {
	FollowedShowID uint   `json:"followedShowId"`
	ShowID         uint   `json:"showId"`
	UserID         uint   `json:"userId"`
	ShowName       string `json:"name"`
	Network        string `json:"network"`
	ImageMedium    string `json:"imageMedium"`
}
