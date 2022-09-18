package repositories

import (
	"context"
	"time"
)

func getContext() (context.Context, context.CancelFunc) {
	return context.WithTimeout(
		context.Background(),
		1500*time.Millisecond,
	)
}