package routes

import "github.com/gofiber/fiber/v2"

func AddRoutes(app *fiber.App) *fiber.App {
	bookRouter(app)

	return app
}
