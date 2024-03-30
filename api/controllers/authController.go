package controllers

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"mishosapi/db"
	modelsdb "mishosapi/models/db"
	modelsdto "mishosapi/models/dto"
	"mishosapi/services"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthController struct{}

func (ac AuthController) AuthTest(context *gin.Context) {
	user, err := services.GetUserFromContext(context)
	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: "unauthorized: could not find valid user"})
		return
	}

	context.JSON(200, gin.H{"message": "This is a test", "user": user})
}

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

	if result := db.DB.Where("username = ?", body.Username).First(&user); result.Error != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": fmt.Sprintf("%d", user.ID),
		"exp":    time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		services.SendError(context, "error signing token")
		return
	}

	sanitizedUser := services.SanitizeUser(user)
	context.JSON(200, gin.H{"user": sanitizedUser, "token": tokenString})
}

func (ac AuthController) Signup(context *gin.Context) {
	var body struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if context.BindJSON(&body) != nil {
		services.SendError(context, "bad request")
		return
	}

	existingCount := int64(0)
	if err := db.DB.Model(&modelsdb.User{}).Where("username = ?", body.Username).Count(&existingCount).Error; err != nil {
		services.SendError(context, err.Error())
		return
	}

	if existingCount > 0 {
		services.SendError(context, "username already exists")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)
	if err != nil {
		services.SendError(context, err.Error())
		return
	}

	user := modelsdb.User{Username: body.Username, Password: string(hash)}

	if result := db.DB.Create(&user); result.Error != nil {
		services.SendError(context, result.Error.Error())
		return
	}

	context.JSON(200, gin.H{"user": services.SanitizeUser(user)})
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
		UserConfig: modelsdto.UserConfigDto{
			NotifierTimezone: config.NotifierTimezone,
			NotifierUrl: config.NotifierUrl,
		},
	}

	context.JSON(200, initData)
}
