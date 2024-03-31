package modelsdb

type UserConfig struct {
	Model
	NotifierTimezone string
	NotifierUrl      string
	UserID           uint
}
