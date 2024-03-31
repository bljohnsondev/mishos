package controllers

import (
	"net/http"

	"mishosapi/db"
	modelsdb "mishosapi/models/db"
	modelsdto "mishosapi/models/dto"
	"mishosapi/services"

	"github.com/gin-gonic/gin"
)

type SettingsController struct{}

func (setc SettingsController) SaveConfigGeneral(context *gin.Context) {
	userDto, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

  var user modelsdb.User

  if err := db.DB.Preload("UserConfig").First(&user, userDto.ID).Error; err != nil {
		services.SendError(context, "user not found")
		return
  }

	var body struct {
		NotifierURL string `json:"notifierUrl" binding:"required"`
	}

	if context.BindJSON(&body) != nil {
		services.SendError(context, "bad request")
		return
	}

	user.UserConfig.NotifierUrl = body.NotifierURL
	if err := db.DB.Save(user.UserConfig).Error; err != nil {
		services.SendError(context, err.Error())
		return
	}

	context.JSON(200, gin.H{"message": "general config saved"})
}
