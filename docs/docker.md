# MISHOS

## Docker Configuration

Here is an example of the `docker-compose.yml` file that I'm personally using:

```yaml
services:
  mishos:
    image: bljohnsondev/mishos:latest
    container_name: mishos
    ports:
      - 8080:80
    environment:
      - TZ=America/Chicago
      - DB_TYPE=sqlite
      - DB_URL=/db/mishos.db
      - SECRET=YOUR_SECRET_KEY_HERE
      - WATCHLIST_RECENT_LIMIT=30
      - TOKEN_DURATION=90
      # - CRON_PROVIDER_UPDATE=21 8 * * *
      # - RUN_MIGRATION=1
    volumes:
      - /home/brent/temp/mishos:/db
    restart: unless-stopped
```

Here is a quick breakdown of the environment variables:

**SQLite**

```
DB_TYPE=sqlite
DB_URL=/db/mishos.db
```

When running this in a docker container don't forget to add a volume mapping for your `DB_URL` SQLite file location.

**MySQL**

```
DB_TYPE=mysql
DB_URL=username:password@tcp(mariadb:3306)/mishos?charset=utf8mb4&parseTime=True&loc=Local
```

Here are some other important environment variables:

- `TZ` - Your preferred timezone if different than the system.
- `SECRET` - Set this to whatever you want but definitely set it to something.  This is the signing key used for authentication.
- `WATCHLIST_RECENT_LIMIT` - This is how many episodes to show on the recently watched tab.
- `CRON_PROVIDER_UPDATE` - This is a cron string that defines the interval to get show updates from the provider.  If unset it defaults to 12 AM.
- `RUN_MIGRATION` - This should be set to `1` for the **first run of the app** only.  This instructs the backend to initialize the empty database.
- `TOKEN_DURATION` - This is the number of days the authentication token is valid.

## First Run

**IMPORTANT**: For the first run with an empty database you need to set `RUN_MIGRATION=1` environment variable in the docker compose file. This causes the backend to initialize the database.  Once this has been completed and your initial user has been created I suggest commenting out `RUN_MIGRATION=1` in the docker compose file and then doing a docker compose `down` and `up` for the change to take effect.  This flag is only needed the first time the application is started (or in the future if any database schema changes are made).

Once everything is set and Mishos has been started for the first time visit `/onboarding` in your browser.
This is a one-time only screen that creates your initial username and password.
Once your user has been created this URL will no longer be available.
