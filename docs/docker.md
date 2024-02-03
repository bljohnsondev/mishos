# MISHOS

## Docker Configuration

The Mishos application consists of two containers - the frontend and the backend.  You can also include a database container if you want to use MySQL or PostgreSQL (or point it at an existing database server).

**NOTE**: If you are watching any long running shows with 10+ seasons I would highly recommend using MySQL or PostgreSQL.  In my testing SQLite tends to be painfully slow when running a *Mark Previous* on 20 seasons of Family Guy.  I'm also running this on a lightweight Debian VM so YMMV.

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

  mishos-be:
    image: bljohnsondev/mishos-api:latest
    container_name: mishos-be
    environment:
      # - DB_TYPE=sqlite
      # - DB_PATH=/db/mishos.db
      - DB_TYPE=mysql
      - DB_URL=mysql://MYSQL_USER:MYSQL_PASS@MYSQL_HOST:3306/mishos
      - CORS=https://mishos.my.home
      - API_URL=https://api.tvmaze.com
      - TOKEN_SECRET=YOUR_SECRET_KEY
      - TOKEN_EXPIRES=30d
```

Here is a quick breakdown of the environment variables:
#### Frontend

`DOCKER_BE_URL`

This is the *internal* URL that the frontend container uses to connect to the backend.  The frontend container runs an [nginx](https://nginx.org/en/) server that serves the frontend code.  It redirects requests to `/api` to the backend container via this `DOCKER_BE_URL`.

Not sure what to set this to or what this means?  Just change the hostname `mishos-be` to whatever you use for the `container_name` of the backend container.
#### Backend

**SQLite**

Want to use SQLite?  You will need these environment variables:

`DB_TYPE=sqlite`
`DB_PATH=/db/mishos.db`

You will also need to mount a volume to your SQLite database so I would also add the following:

```
    volumes:
      - ./db:/db
```

**MySQL / PostgreSQL**

Want to use MySQL or PostgreSQL?  Don't use the SQLite variables!  Use these instead:

`DB_TYPE=mysql`
`DB_URL=mysql://MYSQL_USER:MYSQL_PASS@MYSQL_HOST:3306/YOUR_MISHOS_DB`

Here are some other important environment variables:

- `CORS` - this should match the URL you are using to access the application in your browser.
- `API_URL` - leave it alone.  [TVmaze](https://www.tvmaze.com/) is the excellent provider that Mishos uses to get all the TV data.
- `TOKEN_SECRET` - set this to whatever you want but definitely set it to something.  This is the signing key used for authentication.
- `TOKEN_EXPIRES` - this is the time before the token expires and required you to login again.  In this example it is set to 30 days.
