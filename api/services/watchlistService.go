package services

import (
	"fmt"

	"mishosapi/db"
	modelsdb "mishosapi/models/db"
	modelsdto "mishosapi/models/dto"
)

type WatchListService struct{}

func (ws WatchListService) GetUnwatched(userId uint) (*[]modelsdto.UnwatchedItemDto, error) {
	/*
			watch list data:
			- imageMedium
			- show name
			- episode name
			- episode description
			- season number
		  - episode number
		  - network
		  - air date
		  - runtime
	*/

	var showIds []uint

	err := db.DB.
		Model(&modelsdb.FollowedShow{}).
		Select("followed_shows.show_id").
		Where("followed_shows.user_id = ?", userId).
		Scan(&showIds).
		Error

	if err != nil {
		return nil, err
	}

	if len(showIds) == 0 {
	  return &([]modelsdto.UnwatchedItemDto{}), nil
	}

	fmt.Printf("FOLLOWED SHOW IDS: %+v\n", showIds)

	/*
		err := db.DB.
			Model(&modelsdb.FollowedShow{}).
			Select("followed_shows.id as FollowedShowID, followed_shows.user_id as UserID, followed_shows.show_id as ShowID, shows.name as ShowName, shows.network as Network, shows.image_medium as ImageMedium").
			Joins("left join shows on shows.id = followed_shows.show_id").
			Where("followed_shows.user_id = ?", userId).
			Order("shows.name asc").
			Scan(followedShows).
			Error
	*/

  /*
select
s.id,
s.name,
we.created_at as 'last_watched'
from
shows s
inner join seasons se on se.show_id = s.id
inner join episodes e on e.season_id = se.id
inner join followed_shows fs on fs.show_id = s.id
left join watched_episodes we on we.episode_id = e.id
where 
fs.user_id = 1
and (we.user_id = 1 or we.user_id is null)
and e.aired <= now()
group by s.id
order by max(we.created_at) desc
;
  */
  var unwatched = []modelsdto.UnwatchedItemDto{}

  // get a list of the earliest unwatched episode of each followed show
  err = db.DB.
    Model(&modelsdb.Show{}).
    Select(`
      shows.id as ShowID,
      shows.name as ShowName,
      shows.image_medium as ImageMedium,
      episodes.id as EpisodeID,
      episodes.number as EpisodeNumber,
      episodes.name as EpisodeName,
      seasons.number as SeasonNumber
    `).
    Joins(`
      inner join seasons on seasons.show_id = shows.id
      inner join episodes on episodes.season_id = seasons.id
      inner join followed_shows on followed_shows.show_id = shows.id
      left join watched_episodes on watched_episodes.episode_id = episodes.id
    `).
    Where(`
      followed_shows.user_id = ?
      and watched_episodes.user_id is null
      and episodes.aired <= now()
    `, userId).
    Group("shows.id").
    Scan(&unwatched).
    Error

  if err != nil {
    return nil, err
  }

  // sort the episodes based on when a show was last watched

	return &unwatched, nil
}
