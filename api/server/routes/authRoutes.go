package routes

import (
	"mishosapi/controllers"
	"mishosapi/middlewares"

	"github.com/gin-gonic/gin"
)

func AddAuthRoutes(router *gin.Engine) {
	authController := controllers.AuthController{}

	authRoutes := router.Group("/api/auth")
	{
		authRoutes.POST("/login", authController.Login)
		authRoutes.POST("/signup", authController.Signup)
		authRoutes.GET("/init", middlewares.AuthRequired(), authController.InitData)
	}
}
