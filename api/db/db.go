package db

import (
	"os"

	"github.com/rs/zerolog/log"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"mishosapi/config"
)

var DB *gorm.DB

func Init() {
	dsn := os.Getenv("DB_URL")
	// db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	db, err := gorm.Open(mysql.New(mysql.Config{
		DSN:               dsn,
		DefaultStringSize: config.DefaultStringSize,
	}), &gorm.Config{})

	if err != nil {
		log.Fatal().Err(err).Msg("failed to connect to database")
	}

	DB = db
}
