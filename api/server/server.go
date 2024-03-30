package server

import (
	"fmt"
)

func Start() {
	router := CreateRouter()
	if err := router.Run(); err != nil {
		fmt.Println("error starting server: ", err)
	}
}
