package config

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func LoadCors(router *gin.Engine) {
	/*
	  config := cors.DefaultConfig()
	  // TODO: split the env variable CORS here
	  config.AllowOrigins = []string{"http://localhost:5173"}
	  config.AllowHeaders = []string{"authorization", "content-type"}
	  router.Use(cors.New(config))
	*/
	router.Use(cors.New(cors.Config{
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Origin", "Content-Length", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
		AllowAllOrigins:  true,
	}))
}
