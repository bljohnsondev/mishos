package main

import (
	"os"
	"time"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"

	"mishosapi/config"
	"mishosapi/db"
	"mishosapi/migrations"
	"mishosapi/server"
	"mishosapi/tasks"
)

func init() {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: time.RFC3339})

	config.LoadEnv()
	config.InitTimezone()

	db.Init()
	migrations.RunMigrationIfEnv()
}

func main() {
	taskRunner := tasks.TaskRunner{}
	taskRunner.InitializeTasks()

	log.Info().Msg("server starting...")
	server.Start()
}
