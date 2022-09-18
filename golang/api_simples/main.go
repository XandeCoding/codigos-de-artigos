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
