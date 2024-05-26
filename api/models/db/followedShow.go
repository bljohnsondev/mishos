package modelsdb

type FollowedShow struct {
	Model
	UserID uint
	User   User
	ShowID uint
	Show   Show
}
