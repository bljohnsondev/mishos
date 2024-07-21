package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"mishosapi/db"
	modelsdb "mishosapi/models/db"
	modelsdto "mishosapi/models/dto"
	"mishosapi/services"
)

type AdminController struct{}

const adminRoleName = "admin"

func (ac AdminController) GetUsers(context *gin.Context) {
	userDto, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	if userDto.Role != adminRoleName {
		context.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	var dbUsers []modelsdb.User

	db.DB.Preload("UserRole").Order("id asc").Find(&dbUsers)

	users := []modelsdto.UserDto{}

	for _, user := range dbUsers {
		users = append(users, modelsdto.UserDto{
			ID:       user.ID,
			Username: user.Username,
			Role:     user.UserRole.Name,
		})
	}

	context.JSON(http.StatusOK, gin.H{"users": users})
}

func (ac AdminController) SaveUser(context *gin.Context) {
	userDto, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	if userDto.Role != adminRoleName {
		context.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	var body struct {
		UserID   uint   `json:"id"`
		Username string `json:"username"`
		Role     string `json:"role"`
	}

	if context.BindJSON(&body) != nil {
		services.SendError(context, "bad request")

		return
	}

	var role modelsdb.UserRole

	if err := db.DB.Where("name = ?", body.Role).First(&role).Error; err != nil {
		services.SendError(context, "role not found")
		return
	}

	var user modelsdb.User

	if err := db.DB.First(&user, body.UserID).Error; err != nil {
		services.SendError(context, "user not found")
		return
	}

	user.Username = body.Username
	user.UserRole = role

	if err := db.DB.Save(&user).Error; err != nil {
		services.SendError(context, err.Error())
		return
	}

	editedUser := services.SanitizeUser(user)

	context.JSON(http.StatusOK, gin.H{"message": "user saved", "user": editedUser})
}

func (ac AdminController) DeleteUser(context *gin.Context) {
	userDto, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	if userDto.Role != adminRoleName {
		context.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	var body struct {
		UserID uint `json:"id"`
	}

	if context.BindJSON(&body) != nil {
		services.SendError(context, "bad request")

		return
	}

	var user modelsdb.User

	if err := db.DB.First(&user, body.UserID).Error; err != nil {
		services.SendError(context, "user not found")
		return
	}

	username := user.Username

	// now that the user is identified delete records for foreign keys first
	if err := db.DB.Unscoped().Where("user_id = ?", user.ID).Delete(&modelsdb.FollowedShow{}).Error; err != nil {
		services.SendError(context, "error deleting followed shows")
		return
	}

	if err := db.DB.Unscoped().Where("user_id = ?", user.ID).Delete(&modelsdb.WatchedEpisode{}).Error; err != nil {
		services.SendError(context, "error deleting watched episodes")
		return
	}

	db.DB.Unscoped().Delete(&user)

	context.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("user %s deleted", username)})
}
