package main

import (
	"mishosapi/config"
	"mishosapi/db"
	modelsdb "mishosapi/models/db"
)

func init() {
	config.LoadEnv()
	db.DBInit()
}

func main() {
	err := db.DB.AutoMigrate(&modelsdb.User{})
	if err != nil {
		panic("migrating User failed")
	}

	err = db.DB.AutoMigrate(&modelsdb.UserConfig{})
	if err != nil {
		panic("migrating UserConfig failed")
	}

	err = db.DB.AutoMigrate(&modelsdb.Show{})
	if err != nil {
		panic("migrating Show failed")
	}

	err = db.DB.AutoMigrate(&modelsdb.Season{})
	if err != nil {
		panic("migrating Season failed")
	}

	err = db.DB.AutoMigrate(&modelsdb.Episode{})
	if err != nil {
		panic("migrating Episode failed")
	}

	err = db.DB.AutoMigrate(&modelsdb.FollowedShow{})
	if err != nil {
		panic("migrating FollowedShow failed")
	}

	err = db.DB.AutoMigrate(&modelsdb.WatchedEpisode{})
	if err != nil {
		panic("migrating WatchedEpisode failed")
	}
}
