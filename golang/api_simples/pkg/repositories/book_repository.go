package repositories

import (
	"encoding/json"

	"github.com/XandeCoding/codigos-de-artigos/golang/api_simples/pkg/configurations"
	"github.com/XandeCoding/codigos-de-artigos/golang/api_simples/pkg/entities"

	"github.com/go-redis/redis/v9"
)

type Repository struct {
	database *redis.Client
}

func NewRepository() *Repository {
	return &Repository{
		database: configurations.CreateClient(),
	}
}

func (rdb Repository) GetBook(name string) string {
	ctx, cancel := getContext()
	defer cancel()
	book, _ := rdb.database.Get(ctx, name).Result()

	return book
}

func (rdb Repository) SetBook(key string, value *entities.Book) {
	ctx, cancel := getContext()
	defer cancel()
	bookToSave, err := json.Marshal(value)

	if err != nil {
		panic(err)
	}
	err = rdb.database.Set(ctx, key, bookToSave, 0).Err()

	if err != nil {
		panic(err)
	}
}

func (rdb Repository) DeleteBook(key string) {
	ctx, cancel := getContext()
	defer cancel()

	err := rdb.database.Del(ctx, key).Err()

	if err != nil {
		panic(err)
	}
}
