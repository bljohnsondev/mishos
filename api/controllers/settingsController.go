package controllers

import (
	"net/http"

	"mishosapi/db"
	modelsdb "mishosapi/models/db"
	modelsdto "mishosapi/models/dto"
	"mishosapi/services"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
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

	if user.UserConfig.ID == 0 {
		// this shouldn't happen but throw an error if it does
		services.SendError(context, "config data could not be found")
		return
	}

	user.UserConfig.NotifierUrl = body.NotifierURL

	if err := db.DB.Save(user.UserConfig).Error; err != nil {
		services.SendError(context, err.Error())
		return
	}

	context.JSON(200, gin.H{"message": "general config saved"})
}

func (setc SettingsController) SaveConfigAccount(context *gin.Context) {
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
		PasswordCurrent string `json:"passwordCurrent" binding:"required"`
		PasswordNew1    string `json:"passwordNew1" binding:"required"`
		PasswordNew2    string `json:"passwordNew2" binding:"required"`
	}

	if context.BindJSON(&body) != nil {
		services.SendError(context, "bad request")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.PasswordCurrent)); err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "Current password incorrect"})
		return
	}

	if body.PasswordNew1 != body.PasswordNew2 {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "Passwords do not match"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(body.PasswordNew1), 10)
	if err != nil {
		services.SendError(context, err.Error())
		return
	}

	user.Password = string(hash)

	if err := db.DB.Save(&user).Error; err != nil {
		services.SendError(context, err.Error())
		return
	}

	context.JSON(200, gin.H{"message": "account config saved"})
}
