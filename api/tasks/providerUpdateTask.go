package tasks

import (
  "fmt"
  "time"

	"mishosapi/db"
	modelsdb "mishosapi/models/db"
	"mishosapi/services"
)

var showService = services.ShowService{}

func RunProviderUpdate() {
	type ShowInfo struct {
	  ID uint64
	  Name string
	}

	var shows []ShowInfo

	err := db.DB.Debug().
	  Model(&modelsdb.Show{}).
	  Select("shows.id, shows.name").
	  Joins("inner join followed_shows fs on fs.show_id = shows.id").
		Group("shows.id").
	  Scan(&shows).
		Error

	if err != nil {
	  fmt.Printf("error getting show list for provider update: %s\n", err.Error())
	} else {
	  for _, showInfo := range shows {
	    fmt.Printf("updating data for followed show: %s\n", showInfo.Name)

	    if err := showService.RefreshShow(showInfo.ID); err != nil {
	      fmt.Printf("ERROR: updating show failed: %s\n", err.Error())
	    }

      // sleep for 10 seconds to provide a rate limit for the external API calls
      time.Sleep(10 * time.Second)
	  }
	}
}
