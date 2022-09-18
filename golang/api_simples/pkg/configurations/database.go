package configurations

import "github.com/go-redis/redis/v9"

func CreateClient() *redis.Client {
	redisDatabase := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	return redisDatabase
}
