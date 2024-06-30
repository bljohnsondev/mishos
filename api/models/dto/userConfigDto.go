package modelsdto

type UserConfigDto struct {
	NotifierTimezone string `json:"notifierTimezone"`
	NotifierUrl      string `json:"notifierUrl"`
	Theme            string `json:"theme"`
	HideSpoilers     bool   `json:"hideSpoilers"`
}
