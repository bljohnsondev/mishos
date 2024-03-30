package modelsdb

import (
	"gorm.io/gorm"
)

type FollowedShow struct {
	gorm.Model
	UserID uint
	ShowID uint
	Show   Show
}
