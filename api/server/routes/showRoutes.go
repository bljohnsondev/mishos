package routes

import (
	"mishosapi/controllers"
	"mishosapi/middlewares"

	"github.com/gin-gonic/gin"
)

func AddShowRoutes(router *gin.Engine) {
	showController := controllers.ShowController{}

	authRoutes := router.Group("/api/show", middlewares.AuthRequired())
	{
		authRoutes.POST("/search", showController.Search)
		authRoutes.GET("/view/:showId", showController.GetShow)
		authRoutes.GET("/preview/:providerId", showController.Preview)
		authRoutes.GET("/followed", showController.Followed)
		authRoutes.POST("/add", showController.AddOrFollowShow)
		authRoutes.POST("/unfollow", showController.Unfollow)
		authRoutes.GET("/update/:showId", showController.UpdateShow)
	}
}
