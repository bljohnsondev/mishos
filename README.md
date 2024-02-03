# MISHOS

Watch a lot of TV shows and want to keep track of them?  Me too.

There are some great services out there for tracking your TV shows.  I wanted something to do that and **only** that without using a service that tracks my viewing habits.

Ads?  Episode comments?  Sharing?  Badges?  No thanks.  Just track my TV shows.

- Mishos is a terrible name.  I'm not good at naming things.  I know.
- Open source and self hosted
- Keep a list of followed shows
- Mark episodes as watched
- Watch list for next unwatched episodes and recently watched episodes
- Upcoming view to see upcoming airings of episodes
- Receive notifications prior to air of new episodes (currently via [Apprise](https://github.com/caronc/apprise) notification)

**WARNING**: this project is under active development.  There could be breaking changes that result in data loss.  I've added an *Export Data* button to the *Settings* screen to export your followed shows and watched episodes.  I'm working on an *Import Data* option that will re-add followed shows and watched episodes in the event of a database change that breaks an existing database.

Ready to give it a try?  Head on over to the [Docker instructions](https://github.com/bljohnsondev/mishos/blob/main/docs/docker.md) and give it a shot.
## Technology

- *Frontend* - [Lit](https://lit.dev) web components, [Shoelace](https://shoelace.style/) UI library
- *Backend* - [NestJS](https://nestjs.com/)
	- The default setup uses a SQLite database but can be used with MySQL or PostgreSQL
- *TV Provider Data* - [TVmaze.com](https://www.tvmaze.com/) - great service that provides free TV show data

## Followed Shows

![Screenshot of the show list screen](https://raw.githubusercontent.com/bljohnsondev/mishos/main/docs/assets/shows-screenshot1.png "Shows screenshot")

## Show Search

![Screenshot of the show search results screen](https://raw.githubusercontent.com/bljohnsondev/mishos/main/docs/assets/searchresults-screenshot1.png "Show search screenshot")

## Show Info

![Screenshot of the show details screen](https://raw.githubusercontent.com/bljohnsondev/mishos/main/docs/assets/show-screenshot1.png "Show details screenshot")

## Watch List - Unwatched

![Screenshot of the watch list unwatched screen](https://raw.githubusercontent.com/bljohnsondev/mishos/main/docs/assets/watchlist-screenshot1.png "Watch list unwatched screenshot")

## Watch List - Recently Watched

![Screenshot of the watch list recent screen](https://raw.githubusercontent.com/bljohnsondev/mishos/main/docs/assets/watchlist-recent-screenshot1.png "Watch list recent screenshot")

## Upcoming

![Screenshot of the upcoming screen](https://raw.githubusercontent.com/bljohnsondev/mishos/main/docs/assets/upcoming-screenshot1.png "Upcoming screenshot")

## Settings

![Screenshot of the settings general screen](https://raw.githubusercontent.com/bljohnsondev/mishos/main/docs/assets/settings-general-screenshot1.png "Settings screenshot")

## Gotify Notification

The current backend code is designed to use an [Apprise](https://github.com/caronc/apprise) endpoint for notifications.  I currently use [Gotify](https://github.com/gotify/server) for notifications.  Since the backend server uses Apprise you have a **lot** of notification options.

![Screenshot of Gotify notifications](https://raw.githubusercontent.com/bljohnsondev/mishos/main/docs/assets/gotify.png "Gotify notifications screenshot")
