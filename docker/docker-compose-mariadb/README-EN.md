# Docker Compose - MariaDB

You know when you need to spin up a database to run an API or some project locally, but you don't want to waste time installing and configuring everything on your machine?

The other day, I had to do exactly that. I had a bit of trouble until I got it working, so I decided to share it here — maybe it'll save you almost an hour trying to find an error caused by wrong environment variables 😅.

This is a script I made to use with Docker Compose. If you don't have Docker installed yet, just go to the [official site](https://docs.docker.com/compose/install/linux/) — they have a great installation guide.

Once it's installed, just save the content below in a file called *`docker-compose.yml`*, run the command `docker-compose up` or `docker compose up`, depending on which version you have installed, in the directory where the file is — and done! The database will be running on port 3306 (you can change that, just like the environment variables).

Hope it helps. Thanks and goodbye! ✌️

```yaml
services:
  bancoMariaDb:
    image: mariadb
    restart: always
    container_name: bancoMariaDb
    ports:
      - "3306:3306"
    volumes:
      - .:/code
    environment:
      - MYSQL_ROOT_PASSWORD=web
      - MYSQL_DATABASE=web
```
