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

	context.JSON(200, gin.H{"message": "getting watchlist data", "unwatched": unwatched})
}
