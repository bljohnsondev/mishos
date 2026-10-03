package modelsdb

type UserConfig struct {
	Model
	NotifierTimezone string
	NotifierType     string
	NotifierUrl      string
	Theme            string
	HideSpoilers     bool
	UserID           uint
}
