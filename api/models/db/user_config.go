package modelsdb

type UserConfig struct {
	Model
	NotifierTimezone string
	NotifierUrl      string
	Theme            string
	UserID           uint
}
