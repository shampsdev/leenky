package main

import (
	"context"
	"os"
	"os/signal"

	_ "github.com/go-telegram/bot"
	_ "github.com/go-telegram/bot/models"
)

// Send any text message to the bot after the bot has been started

func main() {
	_, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()
}
