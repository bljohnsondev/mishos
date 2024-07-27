package middlewares

import (
	"fmt"
	"net/http"
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
		if !strings.HasPrefix(authHeader, "Bearer ") {
			context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: "unauthorized"})
			return
		}

		auths := strings.Split(authHeader, " ")
		tokenString := auths[1]

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
			context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: fmt.Sprint("unauthorized: ", err)})
			return
		}

		jwtClaims, ok := token.Claims.(jwt.MapClaims)

		if !ok || !token.Valid || jwtClaims == nil || jwtClaims["userID"] == nil {
			context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: "unauthorized: token missing or invalid"})
			return
		}

		userid, ok := jwtClaims["userID"].(string)
		if !ok {
			context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: "unauthorized: user id type incorrect"})
			return
		}

		if userid == "" {
			context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: "unauthorized: missing user id in token"})
			return
		}

		// now that a user ID has been identified look up the user in the database and add to context
		var users []modelsdb.User

		db.DB.Preload("UserRole").Where("id = ?", userid).Find(&users).Limit(1)

		if len(users) == 0 {
			context.AbortWithStatusJSON(http.StatusUnauthorized, modelsdto.ErrorDto{Error: "unauthorized: user not found"})
			return
		}

		sanitizedUser := modelsdto.UserDto{
			ID:       users[0].ID,
			Username: users[0].Username,
			Role:     users[0].UserRole.Name,
		}

		context.Set("user", sanitizedUser)
	}
}
