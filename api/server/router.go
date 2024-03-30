package server

import (
	"mishosapi/config"
	"mishosapi/server/routes"

	"github.com/gin-gonic/gin"
)

func CreateRouter() *gin.Engine {
	router := gin.Default()
	config.LoadCors(router)
	routes.AddAuthRoutes(router)
	routes.AddShowRoutes(router)
	routes.AddEpisodeRoutes(router)
	routes.AddWatchListRoutes(router)
	return router
}
