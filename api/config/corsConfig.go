package config

import (
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

func LoadCors(router *gin.Engine) {
	corsString := os.Getenv("CORS")

	if strings.TrimSpace(corsString) == "" {
		log.Fatal().Msg("could not find valid CORS env variable")
	}

	origins := strings.Split(os.Getenv("CORS"), ",")

	router.Use(cors.New(cors.Config{
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Origin", "Content-Length", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           CorsMaxAge,
		AllowAllOrigins:  false,
		AllowOrigins:     origins,
	}))
}
