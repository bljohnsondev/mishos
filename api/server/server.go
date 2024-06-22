package server

import (
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

func Start() {
	if strings.TrimSpace(os.Getenv("MODE")) != "dev" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := CreateRouter()

	address := os.Getenv("API_ADDRESS")

	if strings.TrimSpace(address) == "" {
		address = "127.0.0.1:3000"
	}

	if err := router.Run(address); err != nil {
		log.Fatal().Err(err).Msg("error starting server")
	}
}
