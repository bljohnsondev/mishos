# MISHOS

## Docker Configuration

The Mishos application consists of two containers - the frontend and the backend.  You will also need to provide a MySQL database for the backend to connect to.

First let's see an example of the `docker-compose.yml` file that I'm personally using:

```yaml
version: "3"

services:
  mishos-fe:
    image: bljohnsondev/mishos-web:latest
    container_name: mishos-fe
    ports:
      - 8000:80
    environment:
      - DOCKER_BE_URL=http://mishos-be:3000/api
    restart: unless-stopped

  mishos-be:
    image: bljohnsondev/mishos-api:latest
    container_name: mishos-be
    environment:
      - GIN_MODE=release
      - TZ=America/Chicago
      - PORT=3000
      - DB_URL=username:password@tcp(mariadb:3306)/mishos?charset=utf8mb4&parseTime=True&loc=Local
      - SECRET=YOUR_SECRET_KEY_HERE
      - WATCHLIST_RECENT_LIMIT=30
      # - CRON_PROVIDER_UPDATE=21 8 * * *
      # - RUN_MIGRATION=1
    restart: unless-stopped
```

Here is a quick breakdown of the environment variables:
#### Frontend

`DOCKER_BE_URL`

This is the *internal* URL that the frontend container uses to connect to the backend.  The frontend container runs an [nginx](https://nginx.org/en/) server that serves the frontend code.  It redirects requests to `/api` to the backend container via this `DOCKER_BE_URL`.

Not sure what to set this to or what this means?  Just change the hostname `mishos-be` to whatever you use for the `container_name` of the backend container.

#### Backend

**SQLite**

The current rewrite in Go does not support using SQLite yet.  I will be adding this in the near future.

**MySQL**

```
DB_URL=username:password@tcp(mariadb:3306)/mishos?charset=utf8mb4&parseTime=True&loc=Local
```

Here are some other important environment variables:

- `GIN_MODE` - Include this as-is.  This will be moved to the code in the near future but for now include it.
- `TZ` - Your preferred timezone if different than the system.
- `PORT` - The port the backend uses.  If you change this ensure you change it in the `DOCKER_BE_URL` variable.
- `SECRET` - Set this to whatever you want but definitely set it to something.  This is the signing key used for authentication.
- `WATCHLIST_RECENT_LIMIT` - This is how many episodes to show on the recently watched tab.
- `CRON_PROVIDER_UPDATE` - This is a cron string that defines the interval to get show updates from the provider.  If unset it defaults to 12 AM.
- `RUN_MIGRATION` - This should be set to `1` for the **first run of the app** only.  This instructs the backend to initialize the empty database.

## First Run

**IMPORTANT**: For the first run with an empty database you need to set `RUN_MIGRATION=1` environment variable in the docker compose file. This causes the backend to initialize the database.  Once this has been completed and your initial user has been created I suggest commenting out `RUN_MIGRATION=1` in the docker compose file and then doing a docker compose `down` and `up` for the change to take effect.  This flag is only needed the first time the application is started (or in the future if any database schema changes are made).

Once everything is set and Mishos has been started for the first time visit `/onboarding` in your browser.
This is a one-time only screen that creates your initial username and password.
Once your user has been created this URL will no longer be available.
