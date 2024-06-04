package db

import (
	"os"

	"github.com/glebarez/sqlite"
	"github.com/rs/zerolog/log"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"mishosapi/config"
)

var DB *gorm.DB

func Init() {
	dbtype := os.Getenv("DB_TYPE")
	dsn := os.Getenv("DB_URL")

	if dbtype == "sqlite" {
		db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})

		if err != nil {
			log.Fatal().Err(err).Msg("failed to connect to SQLite database")
		}

		DB = db
	} else {
		db, err := gorm.Open(mysql.New(mysql.Config{
			DSN:               dsn,
			DefaultStringSize: config.DefaultStringSize,
		}), &gorm.Config{})

		if err != nil {
			log.Fatal().Err(err).Msg("failed to connect to MySQL database")
		}

		DB = db
	}
}
