package middlewares

import (
	"fmt"
	"os"
	"strings"

	"mishosapi/db"
	modelsdb "mishosapi/models/db"
	modelsdto "mishosapi/models/dto"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthRequired() gin.HandlerFunc {
	return func(context *gin.Context) {
		authHeader := context.Request.Header.Get("Authorization")

		// header auth should be "Bearer TOKEN_STRING"
		auths := strings.Split(authHeader, " ")

		if len(auths) != 2 {
			context.AbortWithStatusJSON(401, modelsdto.ErrorDto{Error: "unauthorized"})
			return
		}

		authType, tokenString := auths[0], auths[1]

		if authType != "Bearer" {
			context.AbortWithStatusJSON(401, modelsdto.ErrorDto{Error: "unauthorized"})
			return
		}

		hmacSampleSecret := []byte(os.Getenv("SECRET"))

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Don't forget to validate the alg is what you expect:
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}

			// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
			return hmacSampleSecret, nil
		})

		if err != nil || token == nil {
			context.AbortWithStatusJSON(401, modelsdto.ErrorDto{Error: fmt.Sprint("unauthorized: ", err)})
			return
		}

		jwtClaims, ok := token.Claims.(jwt.MapClaims)

		if !ok || !token.Valid || jwtClaims == nil || jwtClaims["userID"] == nil {
			context.AbortWithStatusJSON(401, modelsdto.ErrorDto{Error: "unauthorized: token missing or invalid"})
			return
		}

		userid, ok := jwtClaims["userID"].(string)
		if !ok {
			context.AbortWithStatusJSON(401, modelsdto.ErrorDto{Error: "unauthorized: user id type incorrect"})
			return
		}

		if userid == "" {
			context.AbortWithStatusJSON(401, modelsdto.ErrorDto{Error: "unauthorized: missing user id in token"})
			return
		}

		// now that a user ID has been identified look up the user in the database and add to context
		var users []modelsdb.User
		db.DB.Where("id = ?", userid).Find(&users).Limit(1)

		if len(users) == 0 {
			context.AbortWithStatusJSON(401, modelsdto.ErrorDto{Error: "unauthorized: user not found"})
			return
		}

		sanitizedUser := modelsdto.UserDto{
			ID:       users[0].ID,
			Username: users[0].Username,
		}

		context.Set("user", sanitizedUser)
	}
}
