package modelsdb

type User struct {
	Model
	Username        string `gorm:"unique"`
	Password        string
	FollowedShows   []FollowedShow
	WatchedEpisodes []WatchedEpisode
	UserConfig      UserConfig
}
