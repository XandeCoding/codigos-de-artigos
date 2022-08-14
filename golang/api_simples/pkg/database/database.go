package database

import (
	"context"
	"encoding/json"
	"main/pkg/entities"

	"github.com/go-redis/redis/v9"
)

func CreateClient() *redis.Client {
	redisDatabase := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
		Password: "",
		DB: 0,
	})

	return redisDatabase
}

func GetBook(client *redis.Client, name string) string {
	var ctx = context.Background()
	book, err := client.Get(ctx, name).Result()

	if err != nil {
		panic(err)
	}

	return book
}

func AddBook(client *redis.Client, key string, value *entities.Book) {
	var ctx = context.Background()
	bookToSave, _ := json.Marshal(value)
	err := client.Set(ctx, key, bookToSave, 0).Err()

	if err != nil {
		panic(err)
	}
}