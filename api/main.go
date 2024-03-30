package main

import (
	"mishosapi/config"
	"mishosapi/db"
	"mishosapi/server"
)

func init() {
	config.LoadEnv()
	db.DBInit()
}

func main() {
	server.Start()
}
