package controllers

import (
	"net/http"

	modelsdto "mishosapi/models/dto"
	"mishosapi/services"

	"github.com/gin-gonic/gin"
)

type EpisodeController struct{}

var episodeService = services.EpisodeService{}

func (ec EpisodeController) WatchEpisode(context *gin.Context) {
	user, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	var body struct {
		EpisodeID uint `json:"episodeId" binding:"required"`
	}

	if context.BindJSON(&body) != nil {
		services.SendError(context, "bad request")
		return
	}

	watched, err := episodeService.Watch(user.ID, body.EpisodeID)
	if err != nil {
		services.SendError(context, err.Error())
		return
	}

	if watched {
		context.JSON(200, gin.H{"watched": watched, "message": "episode watched"})
	} else {
		context.JSON(200, gin.H{"watched": watched, "message": "episode already watched"})
	}
}

func (ec EpisodeController) WatchPreviousEpisodes(context *gin.Context) {
	user, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	var body struct {
		EpisodeID uint `json:"episodeId" binding:"required"`
	}

	if context.BindJSON(&body) != nil {
		services.SendError(context, "bad request")
		return
	}

	watched, err := episodeService.WatchPrevious(user.ID, body.EpisodeID)

	if err != nil {
		services.SendError(context, err.Error())
		return
	}

	context.JSON(200, gin.H{"watched": watched})
}

func (ec EpisodeController) UnwatchEpisode(context *gin.Context) {
	user, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	var body struct {
		EpisodeID uint `binding:"required"`
	}

	if context.BindJSON(&body) != nil {
		services.SendError(context, "bad request")
		return
	}

	if err := episodeService.Unwatch(user.ID, body.EpisodeID); err != nil {
		services.SendError(context, err.Error())
		return
	}

	context.JSON(200, gin.H{"message": "episode unwatched"})
}
