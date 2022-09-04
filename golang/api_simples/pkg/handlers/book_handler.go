package handlers

import (
	"strings"

	"github.com/XandeCoding/codigos-de-artigos/golang/api_simples/pkg/entities"
	"github.com/XandeCoding/codigos-de-artigos/golang/api_simples/pkg/repositories"

	"github.com/gofiber/fiber/v2"
)

func GetBookHandler(bookRepository *repositories.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		book_name := "book:" + c.Params("name")
		book := bookRepository.GetBook(book_name)

		if book == "" {
			message := map[string]string{"message": "This book don't exists"}
			return c.Status(404).JSON(message)
		}
		return c.SendString(book)
	}
}

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

func DeleteBookHandler(bookRepository *repositories.Repository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		book_name := "book:" + c.Params("name")
		bookRepository.DeleteBook(book_name)

		return c.SendStatus(200)
	}
}
