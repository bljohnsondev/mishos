package db

import (
	"os"
	"time"

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
	} else if dbtype == "mysql" {
		db, err := gorm.Open(mysql.New(mysql.Config{
			DSN:               dsn,
			DefaultStringSize: config.DefaultStringSize,
		}), &gorm.Config{})

		if err != nil {
			log.Fatal().Err(err).Msg("failed to connect to MySQL database")
		}

		// set the maximum amount of time a connection may be reused
		// without this the connections aren't closed in a safe way and the mysql driver may close them unexpectedly
		sqlDB, err := db.DB()
		if err != nil {
			log.Fatal().Err(err).Msg("failed to get a SQL DB connection to MySQL")
		}

		sqlDB.SetConnMaxLifetime(time.Hour)

		DB = db
	} else {
		log.Fatal().Msg("could not find valid DB_TYPE")
	}
}
