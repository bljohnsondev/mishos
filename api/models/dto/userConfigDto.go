package modelsdto

type UserConfigDto struct {
	NotifierTimezone string `json:"notifierTimezone"`
	NotifierType     string `json:"notifierType"`
	NotifierUrl      string `json:"notifierUrl"`
	Theme            string `json:"theme"`
	HideSpoilers     bool   `json:"hideSpoilers"`
}
