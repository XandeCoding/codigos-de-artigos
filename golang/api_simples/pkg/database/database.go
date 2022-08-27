package database

import (
	"context"
	"encoding/json"
	"main/pkg/entities"
	"time"

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
	ctx, cancel := context.WithTimeout(context.Background(), 1500*time.Millisecond)
	defer cancel()
	book, _ := client.Get(ctx, name).Result()

	return book
}

func SetBook(client *redis.Client, key string, value *entities.Book) {
	ctx, cancel := context.WithTimeout(context.Background(), 1500*time.Millisecond)
	defer cancel()
	bookToSave, err := json.Marshal(value)

	if err != nil {
		panic(err)
	}
	err = client.Set(ctx, key, bookToSave, 0).Err()

	if err != nil {
		panic(err)
	}
}

func DeleteBook(client *redis.Client, key string) {
	ctx, cancel := context.WithTimeout(context.Background(), 1500*time.Millisecond)
	defer cancel()

	err := client.Del(ctx, key).Err()

	if err != nil {
		panic(err)
	}
}