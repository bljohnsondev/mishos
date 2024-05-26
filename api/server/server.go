package server

import (
	"github.com/rs/zerolog/log"
)

func Start() {
	router := CreateRouter()
	if err := router.Run(); err != nil {
		log.Fatal().Err(err).Msg("error starting server")
	}
}
