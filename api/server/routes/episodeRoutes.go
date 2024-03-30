package routes

import (
	"mishosapi/controllers"
	"mishosapi/middlewares"

	"github.com/gin-gonic/gin"
)

func AddEpisodeRoutes(router *gin.Engine) {
	episodeController := controllers.EpisodeController{}

	authRoutes := router.Group("/api/episode", middlewares.AuthRequired())
	{
		authRoutes.POST("/watch", episodeController.WatchEpisode)
		authRoutes.POST("/unwatch", episodeController.UnwatchEpisode)
		authRoutes.POST("/watchprevious", episodeController.WatchPreviousEpisodes)
	}
}
