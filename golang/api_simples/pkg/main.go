package main

import "github.com/gofiber/fiber/v2"

func main() {
	app := fiber.New()
	AddRoutes(app)

	app.Listen(":3000")
}
