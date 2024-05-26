package tasks

import (
	"github.com/go-co-op/gocron/v2"
	"github.com/rs/zerolog/log"
)

type TaskRunner struct {
	notifierTask       *NotifierTask
	providerUpdateTask *ProviderUpdateTask
	scheduler          gocron.Scheduler
}

func (tr TaskRunner) InitializeTasks() {
	log.Info().Msg("initializing scheduled tasks")

	sch, err := gocron.NewScheduler()
	if err != nil {
		log.Fatal().Msg("error initializing task scheduler")
	}

	tr.scheduler = sch

	// provider update task
	tr.providerUpdateTask = NewProviderUpdateTask(sch)
	if err := tr.providerUpdateTask.InitTasks(); err != nil {
		log.Fatal().Err(err).Msg("error creating provider update task")
	}

	// notifier task
	tr.notifierTask = NewNotifierTask(sch)
	if err = tr.notifierTask.InitTasks(); err != nil {
		log.Fatal().Err(err).Msg("error initializing notifier tasks")
	}

	tr.scheduler.Start()
}

/*
func (tr TaskRunner) createTestSchedulerTask() error {
	_, err := tr.scheduler.NewJob(
		gocron.CronJob("* * * * *", false),
		gocron.NewTask(func() {
			for _, job := range tr.scheduler.Jobs() {
				log.Debug().Msgf("test scheduler task running: job=%s [%s]", job.Name(), strings.Join(job.Tags(), ","))
			}
		}),
		gocron.WithName("testSchedule"),
	)

	return err
}
*/
