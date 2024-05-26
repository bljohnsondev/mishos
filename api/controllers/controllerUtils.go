package controllers

import (
	"bytes"
	"errors"
	"io"

	"github.com/gin-gonic/gin"
	"github.com/tidwall/gjson"
)

func HandleJsonUpload(context *gin.Context) (result *gjson.Result, err error) {
	header, err := context.FormFile("file")
	if err != nil {
		return nil, err
	}

	file, err := header.Open()
	if err != nil {
		return nil, err
	}

	defer file.Close()

	buf := bytes.NewBuffer(nil)
	if _, err := io.Copy(buf, file); err != nil {
		return nil, err
	}

	jsonString := buf.String()

	if !gjson.Valid(jsonString) {
		return nil, errors.New("invalid JSON data")
	}

	json := gjson.Parse(jsonString)

	return &json, nil
}
