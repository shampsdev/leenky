package main

import (
	"context"
	"os"
	"os/signal"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/tglinked/server/cmd/config"
	"github.com/shampsdev/tglinked/server/pkg/gateways/tg"
	log "github.com/sirupsen/logrus"
)

// @title           TGLinked server
// @version         1.0
// @description     Manage chats, users
// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name X-API-Token
func main() {
	log.SetFormatter(&log.TextFormatter{
		ForceColors:     true,
		FullTimestamp:   true,
		TimestampFormat: "2006-01-02 15:04:05",
	})
	log.SetLevel(log.DebugLevel)

	log.Info("Hello from tglinked tgbot!")

	cfg := config.Load(".env")
	cfg.Print()
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	pgConfig := cfg.PGXConfig()
	pool, err := pgxpool.NewWithConfig(ctx, pgConfig)
	if err != nil {
		log.Fatal("can't create new database pool")
	}
	defer pool.Close()

	b, err := tg.NewBot(ctx, cfg, pool)
	if err != nil {
		log.Fatal("can't create new telegram bot")
	}

	b.Start(ctx)
}
