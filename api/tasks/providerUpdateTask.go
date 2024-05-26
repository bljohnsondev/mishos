package tasks

import (
	"os"

	"github.com/go-co-op/gocron/v2"
	"github.com/rs/zerolog/log"

	"mishosapi/services"
)

type ProviderUpdateTask struct {
	scheduler gocron.Scheduler
}

func (put ProviderUpdateTask) InitTasks() error {
	cron, ok := os.LookupEnv("CRON_PROVIDER_UPDATE")

	if !ok || cron == "" {
		cron = "0 0 * * * "
	}

	log.Info().Msgf("starting nightly provider update task with cron: %s", cron)

	_, err := put.scheduler.NewJob(
		gocron.CronJob(cron, false),
		gocron.NewTask(put.RunProviderUpdate),
		gocron.WithName("providerUpdate"),
	)

	return err
}

func (put ProviderUpdateTask) RunProviderUpdate() {
	showService := services.ShowService{}
	if err := showService.RefreshAllShows(); err != nil {
		log.Error().Err(err).Msg("error running provider update task")
	}
}

func NewProviderUpdateTask(scheduler gocron.Scheduler) *ProviderUpdateTask {
	task := &ProviderUpdateTask{
		scheduler: scheduler,
	}

	return task
}
