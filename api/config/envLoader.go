package config

import (
	"github.com/joho/godotenv"
	"github.com/rs/zerolog/log"
)

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		// no .env file is not a fatal error since docker may inject env vars separately
		log.Warn().Msg("could not load .env file: falling back to OS environment")
	}
}
