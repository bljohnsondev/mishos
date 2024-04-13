package main

import (
	"mishosapi/config"
	"mishosapi/db"
	"mishosapi/tasks"
	"mishosapi/server"
)

func init() {
	config.LoadEnv()
	db.DBInit()
}

func main() {
	tasks.InitializeTasks()
	server.Start()
}
