# Building an Organized API in Golang Using Fiber

After spending some time exploring Go and struggling a bit with its package system (here I must admit it's actually a great system when used properly), I found myself thinking a lot about the best way to organize the study API I was building.

I gathered many examples, including from the Fiber repository, and arrived at a structure that I find quite readable and easy to extend with new features.

> **Disclaimer:** I'm not saying this is the best way to organize a Go API, but it worked for my needs and I believe it can be useful in many cases where a generic API is required.

## What Does This API Do?

[**Repository Link**](https://github.com/XandeCoding/codigos-de-artigos/tree/main/golang/api_simples)

This API was created to store information about books and has only three endpoints:

- **GET:** Returns information about a book
- **PUT:** Adds or updates information about a book
- **DELETE:** Deletes book information

I implemented just the basics, using the Fiber framework which has an approach similar to Express.js that I really liked, combined with Go's advantages like lower memory allocation and incredible speed. The data is stored in Redis, which can be initialized using a docker-compose file.

## Structure
```shell
| api_simples
├── docker-compose.yml
├── docs
│   └── estrutura.png
├── go.mod
├── go.sum
├── main.go
├── pkg
│   ├── configurations
│   │   └── database.go
│   ├── entities
│   │   └── book.go
│   ├── handlers
│   │   └── book_handler.go
│   ├── repositories
│   │   ├── book_repository.go
│   │   └── commons.go
│   └── routes
│       ├── book_router.go
│       └── routes.go
└── README.md
```

I believe it's more valuable to explain the reasoning behind this organization rather than just listing what each folder contains. I won't follow the exact order above since I think it's clearer to explain in a different sequence:

#### go.mod

```go

module github.com/XandeCoding/codigos-de-artigos/golang/api_simples

go 1.19

require (
	github.com/go-redis/redis/v9 v9.0.0-beta.2
	github.com/gofiber/fiber/v2 v2.36.0
```

This file helps resolve various Go workspace issues, allowing me to create a Go repository anywhere without problems accessing external or local packages.

To create it, I ran the go mod init command with the GitHub project path as argument (github.com/XandeCoding/codigos-de-artigos/golang/api_simples). While it's not strictly necessary to use the full GitHub path (the project name api_simples would work), I chose to include it since this is a public project. This makes it easier to reference specific files from the project.

### pkg and main.go

The pkg folder contains the main API code where all features are implemented. The main.go file is only used to initialize the application and contains no implementation logic, serving solely to start the API.

**main.go**:

```go

package main

import (
	"github.com/XandeCoding/codigos-de-artigos/golang/api_simples/pkg/routes"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()
	routes.AddRoutes(app)

	app.Listen(":3000")
}
```

### pkg/configurations

This contains configuration files. In this case, `database.go` configures database access. If we had other application or tool configurations used by one or more parts of the application, they would also go here - such as custom Fiber configurations or environment variables.

Example Redis connection configuration in **database.go**:

```go

package configurations

import "github.com/go-redis/redis/v9"

func CreateClient() *redis.Client {
	redisDatabase := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
		Password: "",
		DB: 0,
	})

	return redisDatabase
}
```

### pkg/entities

Entities can be used in various places, particularly in this case where I use them both for receiving data in endpoints and for database operations. Placing them in a common location is quite useful, though in feature-separated package structures, this approach might not be as ideal.
pkg/repositories

This package contains functions that work directly with the Redis database. They receive the book entity and have functions that insert, update, and delete it from the database. If there were another entity to handle, such as library, it would be in a separate file containing only functions related to that data.

Fragment from **book_repository.go**:

```go

type Repository struct {
	database *redis.Client
}

...

func (rdb Repository) GetBook(name string) string {
	ctx, cancel := getContext()
	defer cancel()
	book, _ := rdb.database.Get(ctx, name).Result()

	return book
}
```

### pkg/routes

Following the example of other parts of the application, I separated routes into different files. Even though we have a routes.go file that initializes these routes, it's helpful to keep routes for specific resources separate for better readability and understanding for others who might maintain the code.

Route initialization in **routes.go**:

```go

func AddRoutes(app *fiber.App) *fiber.App {
	bookRouter(app)

	return app
}
```
In book_router.go, I only specify the routes, methods, and handler functions located in another part of the application. Another important aspect is that this structure allows us to create instances that can be reused across all endpoints for this specific resource - in this case, a Redis database connection instance.

Fragment from **book_router.go**:
```go

func bookRouter(app *fiber.App) *fiber.App {
	bookRepository := repositories.NewRepository()

	app.Get("/book/:name", handlers.GetBookHandler(bookRepository))
	app.Put("/book", handlers.SetBookHandler(bookRepository))
	app.Delete("/book/:name", handlers.DeleteBookHandler(bookRepository))

	return app
}
```

### pkg/handlers

In handlers, I place the functions called by the endpoints. For example, the PUT /book endpoint calls the SetBookHandler function in book_handler.go, which returns the function to be executed when this resource is accessed.

Code for the **SetBookHandler** function:

```go

func SetBookHandler(bookRepository *repositories.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		book := new(entities.Book)
		err := c.BodyParser(book)

		if err != nil {
			message := map[string]string{"message": "Invalid entry data"}
			return c.Status(400).JSON(message)
		}

		book_name_normalized := strings.ReplaceAll(
			strings.ToLower(book.Name), " ", "_",
		)
		key := "book:" + book_name_normalized
		bookRepository.SetBook(key, book)
		return c.Send(c.Body())
	}
}
```
## That's It!

I hope this helps with some of the initial challenges when building an API, especially in a language we're not very familiar with. This initial structure worked well for me, but any comments or feedback are always welcome for continuous improvement. Until next time! :wave:
