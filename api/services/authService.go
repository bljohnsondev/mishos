package services

import (
	"errors"

	modelsdb "mishosapi/models/db"
	modelsdto "mishosapi/models/dto"

	"github.com/gin-gonic/gin"
)

func SanitizeUser(user modelsdb.User) modelsdto.UserDto {
	var sanitizedUser modelsdto.UserDto

	sanitizedUser.ID = user.ID
	sanitizedUser.Username = user.Username
	sanitizedUser.Role = user.UserRole.Name

	return sanitizedUser
}

func GetUserFromContext(context *gin.Context) (*modelsdto.UserDto, error) {
	userFromContext, exists := context.Get("user")
	if !exists {
		return nil, errors.New("context: user not found")
	}

	user, ok := userFromContext.(modelsdto.UserDto)
	if !ok {
		return nil, errors.New("context: invalid user")
	}

	return &user, nil
}
