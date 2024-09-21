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
		authRoutes.POST("/saveaccount", settingsController.SaveConfigAccount)
		authRoutes.POST("/importdata", settingsController.ImportData)
		authRoutes.GET("/exportdata", settingsController.ExportData)
		authRoutes.POST("/sendtest", settingsController.SendTestNotification)
	}
}
