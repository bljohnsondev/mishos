package routes

import (
	"mishosapi/controllers"
	"mishosapi/middlewares"

	"github.com/gin-gonic/gin"
)

func AddAdminRoutes(router *gin.Engine) {
	adminController := controllers.AdminController{}

	adminRoutes := router.Group("/api/admin", middlewares.AuthRequired())
	{
		adminRoutes.GET("/users", adminController.GetUsers)
		adminRoutes.POST("/user/save", adminController.SaveUser)
		adminRoutes.POST("/user/del", adminController.DeleteUser)
	}
}
