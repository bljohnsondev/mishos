package modelsdto

type InitDataDto struct {
	User       UserDto       `json:"user"`
	UserConfig UserConfigDto `json:"userConfig"`
}
