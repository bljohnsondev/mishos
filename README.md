# MISHOS

Watch a lot of TV shows and want to keep track of them?  Me too.

There are some great services out there for tracking your TV shows.  I wanted something to do that and **only** that without using a service that tracks my viewing habits.

Ads?  Episode comments?  Sharing?  Badges?  No thanks.  Just track my TV shows.

- Mishos is a terrible name.  I'm not good at naming things.  I know.
- Open source and self hosted
- Keep a list of followed shows
- Mark episodes as watched
- Watch list for next unwatched episodes and recently watched episodes
- Up next view to see upcoming airings of episodes
- Receive notifications prior to air of new episodes (currently via [Apprise](https://github.com/caronc/apprise) notification)

This project is in it's early stages and there isn't currently a Docker image (yet).  Want to try it out?  You'll need to clone the repo and build it.

## Technology

- *Frontend* - [Lit](https://lit.dev) web components
- *Backend* - NestJS
	- The default setup uses a SQLite database but can be used with MySQL or PostgreSQL

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

## Up Next

![Screenshot of the up next screen](https://raw.githubusercontent.com/bljohnsondev/mishos/main/docs/assets/upnext-screenshot1.png "Up next screenshot")

## Settings

![Screenshot of the settings general screen](https://raw.githubusercontent.com/bljohnsondev/mishos/main/docs/assets/settings-general-screenshot1.png "Settings screenshot")

## Gotify Notification

The current backend code is designed to use an [Apprise](https://github.com/caronc/apprise) endpoint for notifications.  I currently use [Gotify](https://github.com/gotify/server) for notifications.  Since the backend server uses Apprise you have a **lot** of notification options.

![Screenshot of Gotify notifications](https://raw.githubusercontent.com/bljohnsondev/mishos/main/docs/assets/gotify.png "Gotify notifications screenshot")

