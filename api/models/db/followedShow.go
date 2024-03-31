package modelsdb

type FollowedShow struct {
	Model
	UserID uint
	ShowID uint
	Show   Show
}
