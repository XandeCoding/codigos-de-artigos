package main

import (
	"main/pkg/database"
	"main/pkg/entities"

	"github.com/gofiber/fiber/v2"
)

func AddRoutes(app *fiber.App) *fiber.App {
	redisDatabase := database.CreateClient()

	app.Get("/book", func(c *fiber.Ctx) error {
		book := database.GetBook(redisDatabase, "book:teste")
		return c.SendString(book)
	})

	app.Post("/book", func(c *fiber.Ctx) error {
		book := new(entities.Book)
		err := c.BodyParser(book)

		if err != nil {
			return err
		}

		key := "book:" + book.Name
		database.AddBook(redisDatabase, key, book)
		return c.Send(c.Body())
	})

	return app
}
