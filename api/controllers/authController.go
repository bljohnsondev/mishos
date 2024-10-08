package controllers

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"mishosapi/config"
	"mishosapi/db"
	modelsdb "mishosapi/models/db"
	modelsdto "mishosapi/models/dto"
	"mishosapi/services"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthController struct{}

func (ac AuthController) Login(context *gin.Context) {
	var body struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if context.BindJSON(&body) != nil {
		services.SendError(context, "bad request")
		return
	}

	var user modelsdb.User

	if result := db.DB.Preload("UserRole").Where("username = ?", body.Username).First(&user); result.Error != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	tokenDuration := config.JwtTokenDuration

	tdString := strings.TrimSpace(os.Getenv("TOKEN_DURATION"))

	if tdString != "" {
		if durationDays, err := strconv.Atoi(tdString); err == nil {
			tokenDuration = config.DayDuration * time.Duration(durationDays)
		}
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": fmt.Sprintf("%d", user.ID),
		"exp":    time.Now().Add(tokenDuration).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		services.SendError(context, "error signing token")
		return
	}

	sanitizedUser := services.SanitizeUser(user)

	context.JSON(http.StatusOK, gin.H{"user": sanitizedUser, "token": tokenString})
}

func (ac AuthController) InitData(context *gin.Context) {
	user, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: err.Error()})
		return
	}

	var config modelsdb.UserConfig
	err = db.DB.Where("user_id = ?", user.ID).Find(&config).Error

	if err != nil {
		services.SendError(context, err.Error())
		return
	}

	initData := modelsdto.InitDataDto{
		User: modelsdto.UserDto{
			ID:       user.ID,
			Username: user.Username,
			Role:     user.Role,
		},
		UserConfig: modelsdto.UserConfigDto{
			NotifierTimezone: config.NotifierTimezone,
			NotifierUrl:      config.NotifierUrl,
			Theme:            config.Theme,
			HideSpoilers:     config.HideSpoilers,
		},
	}

	context.JSON(http.StatusOK, initData)
}

func (ac AuthController) IsOnboardingReady(context *gin.Context) {
	ready, err := isOnboardingReady()
	if err != nil {
		services.SendError(context, err.Error())
		return
	}

	context.JSON(http.StatusOK, gin.H{"ready": ready})
}

func (ac AuthController) OnboardingCreate(context *gin.Context) {
	ready, err := isOnboardingReady()
	if err != nil {
		services.SendError(context, err.Error())
		return
	}

	// no funny business! onboarding should only happen when there are no users
	if !ready {
		context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var body struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if context.BindJSON(&body) != nil {
		services.SendError(context, "bad request")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), config.BcryptCost)
	if err != nil {
		services.SendError(context, err.Error())
		return
	}

	user := modelsdb.User{
		Username:   body.Username,
		Password:   string(hash),
		UserRoleID: 1, // initial user will have the admin role
	}

	if result := db.DB.Create(&user); result.Error != nil {
		services.SendError(context, result.Error.Error())
		return
	}

	// NOTE: cascading create for an empty config object doesnt create the record so save it separately
	config := modelsdb.UserConfig{
		UserID: user.ID,
	}

	if result := db.DB.Create(&config); result.Error != nil {
		services.SendError(context, result.Error.Error())
		return
	}

	context.JSON(http.StatusOK, gin.H{"user": services.SanitizeUser(user)})
}

func isOnboardingReady() (ready bool, err error) {
	var count int64
	if err := db.DB.Model(&modelsdb.User{}).Count(&count).Error; err != nil {
		return false, err
	}

	return count == 0, nil
}
