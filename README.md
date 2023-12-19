# MISHOS

Watch a lot of TV shows and want to keep track of them?  Me too.

There are some great services out there for tracking your TV shows.  I wanted something to do that and **only** that without using a service that tracks my viewing habits.

Ads?  Episode comments?  Sharing?  Badges?  No thanks.  Just track my TV shows.

- Mishos is a terrible name.  I'm not good at naming things.  I know.
- Open source and self hosted
- Keep a list of shows
- Mark episodes as watched
- Get a watch list of unwatched and upcoming episodes
- Receive notifications prior to air of new episodes (currently via [Apprise](https://github.com/caronc/apprise) notification)

This project is in it's early stages and there isn't currently a Docker image (yet).  Want to try it out?  You'll need to clone the repo and build it.

## Technology

- *Frontend* - React, TailwindCSS *(most likely to be rewritten with [Lit](https://www.lit.dev) web components)*
- *Backend* - NestJS
	- The default setup uses a SQLite database but can be used with MySQL or PostgreSQL
## Shows

![Screenshot of the show list screen](https://raw.githubusercontent.com/bljohnsondev/mishos/main/docs/assets/shows-screenshot1.png "Shows screenshot")

## Show Info

![Screenshot of the show details screen](https://raw.githubusercontent.com/bljohnsondev/mishos/main/docs/assets/show-screenshot1.png "Show details screenshot")

## Watchlist

![Screenshot of the watch list screen](https://raw.githubusercontent.com/bljohnsondev/mishos/main/docs/assets/watchlist-screenshot1.png "Watch list screenshot")
