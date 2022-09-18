# Construindo uma API organizadinha em Golang usando Fiber

Nos últimos tempo brincando com go e apanhando bastante com o sistema de packages dele (aqui cabe um mea-culpa porque é um esquema bem legal se bem utilizado) me peguei pensando bastante em qual seria a melhor forma de organizar a API que estava fazendo de estudo.

Acabei pegando bastantes exemplos inclusive do repositório do [Fiber](https://github.com/gofiber/recipes) e cheguei em um formato que acredito que seja bem legível e fácil de adicionar novas funcionalidades.

`**Disclaimer.:** Não estou dizendo que esta é a melhor forma de se organizar uma API em GoLang mas foi uma que me atendeu e acho que também pode atender em muitos casos onde uma API genérica é necessária.`

## O que essa API faz?

**[Link do repositório](https://github.com/XandeCoding/codigos-de-artigos/tree/api/go-simple-api/golang/api_simples)

Bem essa API foi feita para salvar informações sobre livros e tem somente 3 endpoints:

**GET:** Retorna informações sobre um livro

**PUT:** Adiciona ou altera informações sobre um livro

**DELETE:** Deleta as informações de um livro

Implementei somente o básico mesmo, e para isso usei como framework o Fiber que mencionei logo acima que tem uma pegada bem parecida com Express.js que eu curti bastante, mas com as vantagens de Golang como menor alocação de memória e uma velocidade tremenda, e os dados estão sendo salvos em um Redis o qual é possível inicializar usando um [docker-compose](https://github.com/XandeCoding/codigos-de-artigos/blob/api/go-simple-api/golang/api_simples/docker-compose.yml).

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

Acredito que não faça muito sentido falar somente o que existe em cada pasta, mas sim dizer o porquê e o contexto do porque foi feito desta forma, não vou seguir a ordem ali de cima, pois acho que é mais fácil explicar não seguindo esta ordem, então vamos lá:

**go.mod**

```go
module github.com/XandeCoding/codigos-de-artigos/golang/api_simples

go 1.19

require (
	github.com/go-redis/redis/v9 v9.0.0-beta.2
	github.com/gofiber/fiber/v2 v2.36.0
)
```

Este arquivo me ajuda a resolver várias questões do workspace de go, pois posso criar um repositório de Go onde eu quiser e isso não me traz um problema, por exemplo, de acessar packages tanto externos quanto locais principalmente locais.

Para criar ele somente realizei o comando `go mod init` com o caminho do projeto no github como argumento que no caso é *github.com/XandeCoding/codigos-de-artigos/golang/api_simples*, não necessariamente é necessário por o caminho do github pode ser utilizado somente o nome do projeto que aqui é *api_simples* por exemplo.

Como é algo público que quero fazer, acho que é interessante colocar o caminho inteiro do repositório, pois caso eu ou outro alguém queira usar um arquivo em específico do projeto ele pode somente referenciar o caminho e tudo deve funcionar perfeitamente, pois o caminho inteiro dos outros arquivos módulos estão sendo referenciados.

**pkg e main.go**

A pasta _pkg_ é a pasta onde vou deixar o código da minha API, então todas as features estão implementadas dentro desta pasta e o _main.go_ é somente um arquivo para inicializar a aplicação e não implementa nada, por isso ela fica de fora, e usada somente para realizar o _start_ na API.

`_main.go:_`

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

**pkg/configurations**

Aqui ficam os arquivos de configuração, neste caso temos o arquivo_database.go_ que configura o acesso ao banco, mas caso tivéssemos outras configurações de aplicações ou de ferramentas que seriam utilizadas por uma ou mais partes da aplicação isso ficaria aqui como, por exemplo, uma configuração customizada do fiber ou mesmo capturar as variáveis de ambiente que é um caso de uso bem comum.

**pkg/entities**

Entidades em geral podem ser usadas em vários lugares, principalmente neste caso onde uso tanto para receber o dado no endpoint e fazer o parse quanto nas funções de adicionar o dado no banco. Então colocar em um lugar comum se torna bastante interessante, é claro que há estruturas onde os packages são separados por features e temos escopos mais fechados, aí talvez não fosse interessante esta abordagem que estou usando aqui.

`Exemplo da configuração de conexão com o Redis em _database.go:_`

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

**pkg/repositores**

Neste pacote ficam as funções que trabalham diretamente com o banco Redis então nelas eu recebo o dado de um livro no caso a entidade _book_ e tenho funções que tanto a inserem, atualizam e a deletam do banco. Caso tivesse outra entidade a ser tratada no banco como por exemplo, library_ onde trataria de dados sobre livrarias, ela seria um arquivo separado onde ficariam somente funções relacionadas a estas informações.

`Fragmento de *book_repository.go:*`

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

**pkg/routes**

Seguindo o exemplo de outras partes da aplicação separei as rotas por arquivos, mesmo que tenhamos um arquivo _routes.go_ que inicializa estas rotas é interessante deixarmos as rotas de determinado recurso separados, pois facilita a leitura e o entendimento de outras pessoas que possam vir a dar manutenção no código.

`Parte em que inicializo as rotas em _routes.go:_`

```go
func AddRoutes(app *fiber.App) *fiber.App {
	bookRouter(app)

	return app
}
```

Algo que curti muito é que em *book_router.go* somente explicitei as rotas, métodos e as funções que são os chamados _handlers_ que estão em outra parte da aplicação. Outra coisa importante é que esta estrutura possibilita que criemos instâncias que podem ser reutilizadas em todos os endpoints deste determinado recurso que no caso foi uma instância de conexão com o banco Redis.

`Fragmento onde explicito os recursos de _book_router:_`
```go
func bookRouter(app *fiber.App) *fiber.App {
	bookRepository := repositories.NewRepository()

	app.Get("/book/:name", handlers.GetBookHandler(bookRepository))
	app.Put("/book", handlers.SetBookHandler(bookRepository))
	app.Delete("/book/:name", handlers.DeleteBookHandler(bookRepository))

	return app
}
```

**pkg/handlers**

Em handlers deixo as funções que vão ser chamadas pelos endpoints, por exemplo, o endpoint `_PUT: /book_` chama a função _SetBookHandler_ que está no arquivo *book_handler.go* que retorna a função que vai ser chamada quando este recurso for acessado.

`Código da função _SetBookHandler:_`

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

### Pronto

Espero ter ajudado com alguns pontos de dificuldade que quando começamos uma API principalmente em uma linguagem que não temos tanta intimidade que foi o meu caso pode nos deixar um pouco confusos, mas este foi uma estrutura inicial que curti bastante, mas qualquer comentário ou feedback pode comentar que é sempre bom melhorarmos não é?, até a próxima :wave: