package modelsdb

import "gorm.io/gorm"

type UserConfig struct {
	gorm.Model
	NotifierTimezone string
	NotifierUrl      string
	UserID           uint
}
