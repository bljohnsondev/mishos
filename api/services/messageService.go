package services

import (
	"net/http"

	modelsdto "mishosapi/models/dto"

	"github.com/gin-gonic/gin"
)

func SendError(context *gin.Context, message string) {
	context.JSON(http.StatusInternalServerError, modelsdto.ErrorDto{Error: message})
}
