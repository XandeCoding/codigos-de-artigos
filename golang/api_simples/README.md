# Construindo uma API organizada em Golang usando Fiber

Depois de passar um tempo explorando Go e enfrentando alguns desafios com seu sistema de pacotes (aqui faço um *mea culpa*, pois é um sistema muito interessante quando bem utilizado), comecei a refletir sobre a melhor forma de organizar a API que estava desenvolvendo como estudo.

Consultei vários exemplos, inclusive do repositório do [Fiber](https://github.com/gofiber/recipes), e cheguei a uma estrutura que considero legível e fácil de expandir com novas funcionalidades.

> **Observação:** Não afirmo que esta seja a melhor forma de organizar uma API em Go, mas foi a que atendeu às minhas necessidades e acredito que possa ser útil em muitos casos onde uma API genérica é necessária.

## O que essa API faz?

[**Link do repositório**](https://github.com/XandeCoding/codigos-de-artigos/tree/main/golang/api_simples)

Esta API foi desenvolvida para armazenar informações sobre livros e possui apenas três endpoints:

- **GET:** Retorna informações sobre um livro.
- **PUT:** Adiciona ou altera informações sobre um livro.
- **DELETE:** Exclui as informações de um livro.

Implementei apenas o essencial, utilizando o framework Fiber, que tem uma abordagem semelhante ao Express.js, algo que gostei bastante, combinado com as vantagens do Go, como menor consumo de memória e alta velocidade. Os dados são armazenados em um Redis, que pode ser inicializado usando um [docker-compose](https://github.com/XandeCoding/codigos-de-artigos/blob/api/go-simple-api/golang/api_simples/docker-compose.yml).

## Estrutura

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

Acredito que não seja suficiente apenas listar o conteúdo de cada pasta, mas sim explicar o contexto e a razão por trás dessa organização. Não seguirei a ordem acima, pois acho mais claro explicar de forma não linear. Vamos lá:

### **go.mod**

```go
module github.com/XandeCoding/codigos-de-artigos/golang/api_simples

go 1.19

require (
	github.com/go-redis/redis/v9 v9.0.0-beta.2
	github.com/gofiber/fiber/v2 v2.36.0
```

Esse arquivo resolve várias questões relacionadas ao workspace do Go, permitindo criar um repositório em qualquer local sem problemas de acesso a pacotes externos ou locais.

Para criá-lo, executei o comando `go mod init` com o caminho do projeto no GitHub como argumento (`github.com/XandeCoding/codigos-de-artigos/golang/api_simples`). Embora não seja estritamente necessário usar o caminho completo do GitHub — poderia ser apenas o nome do projeto, como `api_simples` —, optei por incluí-lo por se tratar de um projeto público. Isso facilita a referência a arquivos específicos por mim ou por outras pessoas.

### **pkg e main.go**

A pasta `pkg` contém o código principal da API, onde todas as funcionalidades são implementadas. O arquivo `main.go`, por sua vez, é responsável apenas pela inicialização da aplicação, sem implementar lógica alguma.

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

### **pkg/configurations**

Aqui estão os arquivos de configuração. No caso, `database.go` configura o acesso ao banco de dados. Se houvesse outras configurações, como configurações personalizadas do Fiber ou variáveis de ambiente, elas também ficariam aqui.

Exemplo de configuração de conexão com o Redis em **database.go**:

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

### **pkg/entities**

As entidades são estruturas que podem ser utilizadas em várias partes da aplicação, como na análise de dados recebidos nos endpoints e nas operações de banco de dados. Centralizá-las em um local comum é vantajoso, embora em estruturas baseadas em funcionalidades específicas possa fazer mais sentido separá-las por escopos.

### **pkg/repositories**

Este pacote contém as funções que interagem diretamente com o banco de dados Redis. Por exemplo, recebem a entidade `book` e realizam operações de inserção, atualização e exclusão. Se houvesse outra entidade, como `library`, suas funções relacionadas ficariam em um arquivo separado.

Trecho de **book_repository.go**:

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

### **pkg/routes**

As rotas foram organizadas em arquivos separados para melhor legibilidade e manutenção. O arquivo `routes.go` inicializa todas as rotas, enquanto `book_router.go` define as rotas específicas para o recurso `book`.

Trecho de **routes.go**:

```go
func AddRoutes(app *fiber.App) *fiber.App {
	bookRouter(app)

	return app
}
```

Em `book_router.go`, as rotas, métodos e handlers são definidos. Uma vantagem dessa estrutura é a possibilidade de criar instâncias reutilizáveis, como a conexão com o Redis, que pode ser compartilhada entre os endpoints.

Trecho de `book_router.go`:

```go
func bookRouter(app *fiber.App) *fiber.App {
	bookRepository := repositories.NewRepository()

	app.Get("/book/:name", handlers.GetBookHandler(bookRepository))
	app.Put("/book", handlers.SetBookHandler(bookRepository))
	app.Delete("/book/:name", handlers.DeleteBookHandler(bookRepository))

	return app
}
```

### **pkg/handlers**

Os handlers são as funções chamadas pelos endpoints. Por exemplo, o endpoint `PUT /book` chama a função `SetBookHandler`, localizada em `book_handler.go`, que retorna a função a ser executada quando o recurso é acessado.

Código da função **SetBookHandler**:

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

## Conclusão

Espero ter ajudado a esclarecer alguns dos desafios iniciais ao desenvolver uma API, especialmente em uma linguagem com a qual não temos muita familiaridade. Essa estrutura foi eficaz para mim, mas comentários e feedbacks são sempre bem-vindos para continuarmos melhorando. Até a próxima! :wave:
