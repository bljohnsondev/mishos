package config

import (
	"time"
)

const (
	BcryptCost              int           = 10
	CorsMaxAge              time.Duration = 12 * time.Hour
	DefaultStringSize       uint          = 1024
	ProviderRateLimit       time.Duration = 10 * time.Second
	JwtTokenDuration        time.Duration = time.Hour * 24 * 30
	NotificationCallTimeout time.Duration = 10 * time.Second
	DayDuration             time.Duration = 24 * time.Hour
)
