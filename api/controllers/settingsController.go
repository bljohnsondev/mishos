package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"mishosapi/config"
	"mishosapi/db"
	modelsdb "mishosapi/models/db"
	modelsdto "mishosapi/models/dto"
	"mishosapi/services"
	"mishosapi/tasks"
)

type SettingsController struct{}

var settingsService = services.SettingsService{}

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
		NotifierURL  string `json:"notifierUrl"`
		Theme        string `json:"theme"`
		HideSpoilers bool   `json:"hideSpoilers"`
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
	user.UserConfig.Theme = body.Theme
	user.UserConfig.HideSpoilers = body.HideSpoilers

	if err := db.DB.Save(user.UserConfig).Error; err != nil {
		services.SendError(context, err.Error())

		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "general config saved"})
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

	hash, err := bcrypt.GenerateFromPassword([]byte(body.PasswordNew1), config.BcryptCost)
	if err != nil {
		services.SendError(context, err.Error())
		return
	}

	user.Password = string(hash)

	if err := db.DB.Save(&user).Error; err != nil {
		services.SendError(context, err.Error())
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "account config saved"})
}

func (setc SettingsController) ImportData(context *gin.Context) {
	userDto, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	json, err := HandleJsonUpload(context)

	if err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	if json == nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, modelsdto.ErrorDto{Error: "no valid JSON found"})
		return
	}

	if err := settingsService.ImportFile(userDto.ID, *json); err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"imported": true, "message": "successfully imported tv data"})
}

func (setc *SettingsController) ExportData(context *gin.Context) {
	userDto, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	shows, err := settingsService.ExportData(userDto.ID)

	if err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"shows": shows})
}

func (setc *SettingsController) SendTestNotification(context *gin.Context) {
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
		URL string `json:"url"`
	}

	if context.BindJSON(&body) != nil {
		services.SendError(context, "bad request")

		return
	}

	payload := tasks.NotificationPayload{
		Title: "Test TV Show",
		Body:  "Episode S01E99 Testing 1 2 3",
	}

	err = tasks.SendNotificationToURL(body.URL, payload)

	if err != nil {
		context.AbortWithStatusJSON(http.StatusBadRequest, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	context.Status(http.StatusOK)
}
