package tasks

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/go-co-op/gocron/v2"
	"github.com/mikestefanello/hooks"
	"github.com/rs/zerolog/log"

	"mishosapi/apphooks"
	"mishosapi/config"
	"mishosapi/db"
	modelsdb "mishosapi/models/db"
)

type NotifierTask struct {
	scheduler gocron.Scheduler
}

type NotifierEpisode struct {
	EpisodeID     uint
	ShowID        uint
	ShowName      string
	SeasonNumber  uint
	EpisodeNumber uint
	EpisodeName   string
	AirDate       time.Time
}

type NotificationPayload struct {
	Title string `json:"title"`
	Body  string `json:"body"`
}

func (nt NotifierTask) InitTasks() error {
	var followedShows []modelsdb.FollowedShow

	if err := db.DB.Preload("Show").Preload("User").Preload("User.UserConfig").Find(&followedShows).Error; err != nil {
		return err
	}

	// remove any pre-existing tasks for job notification
	nt.scheduler.RemoveByTags("notifier")

	for _, followedShow := range followedShows {
		if err := nt.CreateNotifierTask(followedShow.User, followedShow.Show.ID, nil); err != nil {
			log.Error().Err(err).Msg("error initializing notifier tasks")
		}
	}

	return nil
}

func (nt NotifierTask) UpdateNotifierTask(userId uint, showId uint) error {
	taskName := fmt.Sprintf("notifier:%d:%d", userId, showId)

	// remove any existing task
	for _, job := range nt.scheduler.Jobs() {
		if job.Name() == taskName {
			if err := nt.scheduler.RemoveJob(job.ID()); err != nil {
				return err
			}

			break
		}
	}

	var followedShows []modelsdb.FollowedShow

	if err := db.DB.Preload("Show").Preload("User").Preload("User.UserConfig").Where("user_id = ? and show_id = ?", userId, showId).Find(&followedShows).Error; err != nil {
		return err
	}

	if len(followedShows) > 0 {
		followedShow := followedShows[0]

		if err := nt.CreateNotifierTask(followedShow.User, followedShow.Show.ID, nil); err != nil {
			return err
		}
	}

	return nil
}

func (nt NotifierTask) RunNotifierTask(user modelsdb.User, episode NotifierEpisode) error {
	if strings.TrimSpace(user.UserConfig.NotifierUrl) == "" {
		return nil
	}

	err := nt.sendNotification(user, episode.ShowName, fmt.Sprintf("Episode S%dE%d starting in an hour: %s", episode.SeasonNumber, episode.EpisodeNumber, episode.EpisodeName))
	if err != nil {
		return err
	}

	if err := nt.CreateNotifierTask(user, episode.ShowID, &episode.EpisodeID); err != nil {
		return err
	}

	return nil
}

func (nt NotifierTask) CreateNotifierTask(user modelsdb.User, showId uint, skipEpisodeId *uint) error {
	if user.ID == 0 || user.UserConfig.ID == 0 || strings.TrimSpace(user.UserConfig.NotifierUrl) == "" {
		return nil
	}

	taskName := fmt.Sprintf("notifier:%d:%d", user.ID, showId)

	// remove any existing task
	for _, job := range nt.scheduler.Jobs() {
		if job.Name() == taskName {
			if err := nt.scheduler.RemoveJob(job.ID()); err != nil {
				return err
			}

			break
		}
	}

	episode, err := nt.findUpcomingEpisode(showId, skipEpisodeId)
	if err != nil {
		return err
	}

	if episode != nil {
		if err := nt.addNotifierTask(user, *episode); err != nil {
			return err
		}
	}

	return nil
}

func (nt NotifierTask) ListenFollowEvents(event hooks.Event[apphooks.FollowPayload]) {
	payload := event.Msg
	log.Debug().Msgf("updating notifier task: user=%d show=%d followed=%t", payload.UserID, payload.ShowID, payload.Followed)

	if err := nt.UpdateNotifierTask(payload.UserID, payload.ShowID); err != nil {
		log.Error().Err(err).Msgf("error updating notifier task after follow : %+v", payload)
	}
}

func (nt NotifierTask) findUpcomingEpisode(showId uint, skipEpisodeId *uint) (*NotifierEpisode, error) {
	var episodes []NotifierEpisode

	// only find episodes with air airdate > now + 1 hour since notifications are an hour before air
	airdate := time.Now().Add(time.Duration(1) * time.Hour)

	db := db.DB.
		Model(&modelsdb.Episode{}).
		Select(`
		  episodes.id as EpisodeID,
		  episodes.number as EpisodeNumber,
			episodes.name as EpisodeName,
		  episodes.aired as AirDate,
		  s.id as ShowID,
		  s.name as ShowName,
		  sea.number as SeasonNumber
		`).
		Joins(`
      inner join seasons sea on sea.id = episodes.season_id
      inner join shows s on s.id = sea.show_id
    `).
		Where("s.id = ? and episodes.aired is not null && episodes.aired > ?", showId, airdate)

	if skipEpisodeId != nil {
		db.Where("episodes.id <> ?", *skipEpisodeId)
	}

	if err := db.Scan(&episodes).Limit(1).Error; err != nil {
		return nil, err
	}

	if len(episodes) > 0 {
		return &episodes[0], nil
	} else {
		return nil, nil
	}
}

func (nt NotifierTask) addNotifierTask(user modelsdb.User, episode NotifierEpisode) error {
	notifyTime := episode.AirDate.Add(time.Duration(-1) * time.Hour)

	log.Info().Msgf("creating a new notifier task: %s : [%d] S%dE%d: next run %s",
		episode.ShowName,
		episode.EpisodeID,
		episode.SeasonNumber,
		episode.EpisodeNumber,
		notifyTime,
	)

	_, err := nt.scheduler.NewJob(
		gocron.OneTimeJob(gocron.OneTimeJobStartDateTime(notifyTime)),
		gocron.NewTask(
			func() {
				if err := nt.RunNotifierTask(user, episode); err != nil {
					log.Error().Err(err).Msg("error running notifier task")
				}
			},
		),
		gocron.WithName(fmt.Sprintf("notifier:%d:%d", user.ID, episode.ShowID)),
		gocron.WithTags("notifier"),
	)

	return err
}

func (nt NotifierTask) sendNotification(user modelsdb.User, title string, body string) error {
	url := user.UserConfig.NotifierUrl

	/*
		for now the payload for notification is hard coded and specific to Apprise - make this customizable
		using some sort of JSON template
	*/

	payload := NotificationPayload{
		Title: title,
		Body:  body,
	}

	return SendNotificationToURL(url, payload)
}

func SendNotificationToURL(url string, payload NotificationPayload) error {
	if strings.TrimSpace(url) == "" {
		return nil
	}

	marshalled, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	request, err := http.NewRequest("POST", url, bytes.NewReader(marshalled))
	if err != nil {
		return err
	}

	request.Header.Set("Content-Type", "application/json")

	client := http.Client{Timeout: config.NotificationCallTimeout}
	response, err := client.Do(request)

	if err != nil {
		return err
	}

	// if there was no error apprise should have processed the call
	defer response.Body.Close()

	/*
		bodyBytes, _ := io.ReadAll(response.Body)
		fmt.Printf("########### RECEIVED POST RESPONSE: %s\n", string(bodyBytes))
	*/

	return nil
}

func NewNotifierTask(scheduler gocron.Scheduler) *NotifierTask {
	task := &NotifierTask{
		scheduler: scheduler,
	}

	// update the notifier task for a user+show when a follow or unfollow hook triggers
	apphooks.OnFollow.Listen(task.ListenFollowEvents)
	apphooks.OnUnfollow.Listen(task.ListenFollowEvents)

	return task
}
