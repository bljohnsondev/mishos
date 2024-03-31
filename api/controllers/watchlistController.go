package controllers

import (
	"net/http"

	modelsdto "mishosapi/models/dto"
	"mishosapi/services"

	"github.com/gin-gonic/gin"
)

type WatchListController struct{}

var watchlistService = services.WatchListService{}

func (wc WatchListController) GetUnwatched(context *gin.Context) {
	user, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	unwatched, err := watchlistService.GetUnwatched(user.ID)
	if err != nil {
		services.SendError(context, err.Error())
		return
	}

	context.JSON(200, gin.H{"unwatched": unwatched})
}

func (wc WatchListController) GetRecent(context *gin.Context) {
	user, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	watched, err := watchlistService.GetRecent(user.ID)
	if err != nil {
		services.SendError(context, err.Error())
		return
	}

	context.JSON(200, gin.H{"recent": watched})
}

func (wc WatchListController) GetUpcoming(context *gin.Context) {
	user, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	upcoming, err := watchlistService.GetUpcoming(user.ID)
	if err != nil {
		services.SendError(context, err.Error())
		return
	}

	context.JSON(200, gin.H{"upcoming": upcoming})
}
