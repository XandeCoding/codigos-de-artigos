# Spinning Up PostgreSQL with Docker Compose + Dashboard

*Hello, database lovers!* (I know that doesn’t really exist, but hey — I'm trying to break the ice here 🫠)

I want to share a script to spin up **PostgreSQL** using `docker-compose`, which can be useful for anyone
looking for something really simple: just get it running, with a pretty dashboard to visualize data and run some queries too.

Without further ado, let’s get to the code:

```yaml
services:
  database_postgres:    
    image: postgres:latest
    ports:
      - 5432:5432
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_USER: username
      POSTGRES_DB: database_name 
    volumes:
      - ${HOME}/postgres-data/:/var/lib/postgresql/data    
      
  pgweb:
    container_name: pgweb
    restart: always
    image: sosedoff/pgweb
    ports:
      - 8081:8081
    links:
      - database_postgres:database_postgres
    environment:
      - PGWEB_DATABASE_URL=postgres://username:password@database_postgres:5432/database_name?sslmode=disable
    depends_on:
      - database_postgres
```

---

## 🛠 Explaining in Detail

### `database_postgres`

Nothing new under the sun here. Just some variables to initialize the database with a user.

But the **trick** is in the `volumes`:  
Here we make sure the data is saved in a directory inside your `HOME`,  
so all database data will persist there.

👉 This way, if you run `docker-compose down` (or `docker compose down`, depending on your version),  
you won’t lose your data.

It's not ideal for production, but it can help you in a lot of cases! 😂

---

### `pgweb` (Dashboard)

We’ve got two cool things here:

- The **connection URL** is passed via environment variable, which is super convenient.
- `links` creates a connection between the services — it defines an alias, allowing the `pgweb` container
to access the `database_postgres` by name.

Also, `depends_on` ensures that the database starts **before** the dashboard,  
which helps prevent connection issues.

---

## 🚀 Running Everything

After running a simple:

```bash
docker-compose up
```

You can access your dashboard in the browser at:

```
http://localhost:8081/
```

There you can run queries or just visualize your data — all right in your browser,  
no need to install anything else.

---

## ✌️ That’s it!

I hope you found this article useful.  
If you have any questions, feel free to reach out in the comments 🤙
