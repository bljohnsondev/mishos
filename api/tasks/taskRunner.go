package tasks

import (
  "fmt"

  "github.com/go-co-op/gocron/v2"
)

func InitializeTasks() {
  fmt.Println("initializing scheduled tasks")

  scheduler, err := gocron.NewScheduler()
  if err != nil {
		panic("error initializing task scheduler")
  }

  if err = runProviderUpdateTask(scheduler); err != nil {
		fmt.Println(err.Error())
		panic("error creating provider update task")
  }

  scheduler.Start()
}

func runProviderUpdateTask(scheduler gocron.Scheduler) error {
  _, err := scheduler.NewJob(
    gocron.CronJob("0 0 * * *", false),
    gocron.NewTask(RunProviderUpdate),
  )

  return err
}
