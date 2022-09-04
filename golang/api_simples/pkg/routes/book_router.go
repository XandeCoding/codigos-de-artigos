package routes

import (
	"github.com/XandeCoding/codigos-de-artigos/golang/api_simples/pkg/handlers"
	"github.com/XandeCoding/codigos-de-artigos/golang/api_simples/pkg/repositories"

	"github.com/gofiber/fiber/v2"
)

func bookRouter(app *fiber.App) *fiber.App {
	bookRepository := repositories.NewRepository()

	app.Get("/book/:name", handlers.GetBookHandler(bookRepository))
	app.Put("/book", handlers.SetBookHandler(bookRepository))
	app.Delete("/book/:name", handlers.DeleteBookHandler(bookRepository))

	return app
}
