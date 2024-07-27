package migrations

import (
	"errors"
	"os"

	"mishosapi/db"
	modelsdb "mishosapi/models/db"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

func RunMigration() {
	err := db.DB.AutoMigrate(&modelsdb.User{})
	if err != nil {
		log.Fatal().Err(err).Msg("migrating User failed")
	}

	err = db.DB.AutoMigrate(&modelsdb.UserRole{})
	if err != nil {
		log.Fatal().Err(err).Msg("migrating UserRole failed")
	}

	if db.DB.Migrator().HasTable(&modelsdb.UserRole{}) {
		// if the user_role table exists and is empty insert the new data
		if err := db.DB.First(&modelsdb.UserRole{}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
			roles := []modelsdb.UserRole{
				{Name: "admin"},
				{Name: "user"},
			}

			if err := db.DB.Save(roles).Error; err != nil {
				log.Fatal().Err(err).Msg("migrating UserRole failed inserting initial data")
			}

			// if no user has a role then add the admin role to the first user
			var countRoleSet int64

			db.DB.Model(&modelsdb.User{}).Where("user_role_id is not null").Count(&countRoleSet)

			if countRoleSet == 0 {
				var firstUser modelsdb.User
				result := db.DB.First(&firstUser)

				if result.RowsAffected > 0 {
					log.Info().Msgf(
						"db migration found no user roles - setting user \"%s\" as admin",
						firstUser.Username,
					)

					firstUser.UserRoleID = 1
					db.DB.Save(firstUser)
				}
			}
		}
	} else {
		log.Fatal().Msg("UserRole table missing after auto migration")
	}

	err = db.DB.AutoMigrate(&modelsdb.UserConfig{})
	if err != nil {
		log.Fatal().Err(err).Msg("migrating UserConfig failed")
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

func RunMigrationIfEnv() {
	runMigration, ok := os.LookupEnv("RUN_MIGRATION")

	if ok && runMigration == "1" {
		log.Info().Msg("running database migration with RUN_MIGRATION env set to 1")
		RunMigration()
	}
}
