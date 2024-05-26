package config

import (
	"os"
	"time"
	_ "time/tzdata"

	"github.com/rs/zerolog/log"
)

func InitTimezone() {
	timezone, ok := os.LookupEnv("TZ")

	if ok && timezone != "" {
		loc, err := time.LoadLocation(timezone)

		if err != nil {
			log.Warn().Err(err).Msg("error setting timezone")
			return
		}

		log.Info().Msgf("current timezone: %s", timezone)

		time.Local = loc
	} else {
		log.Warn().Msg("no default timezone set")
	}
}
