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
			message := map[string]string{"message": "This book don't exists"}
			return c.Status(404).JSON(message)
		}
		return c.SendString(book)
	})

	app.Put("/book", func(c *fiber.Ctx) error {
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
		database.SetBook(redisDatabase, key, book)
		return c.Send(c.Body())
	})

	app.Delete("/book/:name", func(c *fiber.Ctx) error {
		book_name := "book:" + c.Params("name")
		database.DeleteBook(redisDatabase, book_name)

		return c.SendStatus(200)
	})

	return app
}
