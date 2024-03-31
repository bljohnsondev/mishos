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
		authRoutes.GET("/init", middlewares.AuthRequired(), authController.InitData)
		authRoutes.GET("/onboarding/ready", authController.IsOnboardingReady)
		authRoutes.POST("/onboarding/create", authController.OnboardingCreate)
	}
}
