package routes

import (
	"mishosapi/controllers"
	"mishosapi/middlewares"

	"github.com/gin-gonic/gin"
)

func AddWatchListRoutes(router *gin.Engine) {
	watchlistController := controllers.WatchListController{}

	authRoutes := router.Group("/api/watchlist", middlewares.AuthRequired())
	{
		authRoutes.GET("/unwatched", watchlistController.GetUnwatched)
		authRoutes.GET("/recent", watchlistController.GetRecent)
		authRoutes.GET("/upcoming", watchlistController.GetUpcoming)
	}
}
