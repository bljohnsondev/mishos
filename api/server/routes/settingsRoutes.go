package routes

import (
	"mishosapi/controllers"
	"mishosapi/middlewares"

	"github.com/gin-gonic/gin"
)

func AddSettingsRoutes(router *gin.Engine) {
	settingsController := controllers.SettingsController{}

	authRoutes := router.Group("/api/settings", middlewares.AuthRequired())
	{
		authRoutes.POST("/savegeneral", settingsController.SaveConfigGeneral)
	}
}
