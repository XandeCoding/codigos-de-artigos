package main

import (
	"main/pkg/database"
	"main/pkg/entities"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func AddRoutes(app *fiber.App) *fiber.App {
	redisDatabase := database.CreateClient()

	app.Get("/book/:name", func(c *fiber.Ctx) error {
		book_name := "book:" + c.Params("name")
		book := database.GetBook(redisDatabase, book_name)

		if book == "" {
			return c.SendStatus(404)
		}
		return c.SendString(book)
	})

	app.Post("/book", func(c *fiber.Ctx) error {
		book := new(entities.Book)
		err := c.BodyParser(book)

		if err != nil {
			return err
		}

		book_name_normalized := strings.ReplaceAll(
			strings.ToLower(book.Name), " ", "_",
		)
		key := "book:" + book_name_normalized
		database.AddBook(redisDatabase, key, book)
		return c.Send(c.Body())
	})

	return app
}
