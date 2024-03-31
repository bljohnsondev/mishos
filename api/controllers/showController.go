package controllers

import (
	"net/http"
	"strconv"

	modelsdb "mishosapi/models/db"
	modelsdto "mishosapi/models/dto"
	"mishosapi/services"

	"github.com/gin-gonic/gin"
)

type ShowController struct{}

var showService = services.ShowService{}

func (sc ShowController) GetShow(context *gin.Context) {
	user, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	showParam := context.Param("showId")
	if showParam == "" {
		services.SendError(context, "show id not found")
		return
	}

	showId, err := strconv.ParseUint(showParam, 10, 32)
	if err != nil {
		services.SendError(context, err.Error())
		return
	}

	show, err := showService.GetShow(user.ID, showId)
	if err != nil {
		services.SendError(context, err.Error())
		return
	}

	context.JSON(200, gin.H{"show": show})
}

func (sc ShowController) AddOrFollowShow(context *gin.Context) {
	user, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	var body struct {
		ProviderID string `json:"providerId" binding:"required"`
	}

	if context.BindJSON(&body) != nil {
		services.SendError(context, "bad request")
		return
	}

	var show modelsdb.Show

	added, err := showService.CreateShow(body.ProviderID, &show)
	if err != nil {
		services.SendError(context, err.Error())
		return
	}

	if show.ID == 0 {
		services.SendError(context, "Could not identify show to add")
		return
	}

	if err = showService.Follow(user.ID, show.ID); err != nil {
		services.SendError(context, err.Error())
		return
	}

	// TODO: when a show is followed recalculate the notifier schedule
	// this hasn't been written in Go but comment added as a placeholder

	message := ""

	if added {
		message = "show added and followed"
	} else {
		message = "show followed"
	}

	context.JSON(200, gin.H{"message": message, "show": gin.H{"id": show.ID, "name": show.Name}})
}

func (sc ShowController) Follow(context *gin.Context) {
	user, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	var body struct {
		ShowID uint `binding:"required"`
	}

	if context.BindJSON(&body) != nil {
		services.SendError(context, "bad request")
		return
	}

	if err = showService.Follow(user.ID, body.ShowID); err != nil {
		services.SendError(context, err.Error())
		return
	}

	context.JSON(200, gin.H{"message": "show followed"})
}

func (sc ShowController) Unfollow(context *gin.Context) {
	user, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	var body struct {
		ShowID uint `json:"showId" binding:"required"`
	}

	if context.BindJSON(&body) != nil {
		services.SendError(context, "bad request")
		return
	}

	if err := showService.Unfollow(user.ID, body.ShowID); err != nil {
		services.SendError(context, err.Error())
		return
	}

	context.JSON(200, gin.H{"message": "show unfollowed"})
}

func (sc ShowController) Followed(context *gin.Context) {
	user, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	var followedShows []modelsdto.FollowedShowDto
	if err = showService.FindFollowed(user.ID, &followedShows); err != nil {
		services.SendError(context, err.Error())
		return
	}

	context.JSON(200, gin.H{"followedShows": followedShows})
}

func (sc ShowController) Search(context *gin.Context) {
	user, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	var body struct {
		Query string `json:"query"`
	}

	if context.BindJSON(&body) != nil {
		services.SendError(context, "bad request")
		return
	}

	var results []modelsdto.ShowSearchResultDto
	if err := showService.SearchShow(user.ID, body.Query, &results); err != nil {
		services.SendError(context, err.Error())
		return
	}

	context.JSON(200, gin.H{"results": results})
}

func (sc ShowController) Preview(context *gin.Context) {
	_, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	providerId := context.Param("providerId")
	if providerId == "" {
		services.SendError(context, "provider id not found")
		return
	}

	var show modelsdb.Show

	if err := showService.PreviewShow(providerId, &show); err != nil {
		services.SendError(context, err.Error())
		return
	}

	context.JSON(200, gin.H{"show": show})
}
