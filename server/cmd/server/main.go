package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"

	"github.com/go-telegram/bot"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/tglinked/server/cmd/config"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
	"github.com/shampsdev/tglinked/server/pkg/utils/slogx"
)

// @title           TGLinked server
// @version         1.0
// @description     Manage chats, users
// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name X-API-Token
func main() {
	cfg := config.Load(".env")
	cfg.Print()

	log := cfg.Logger()
	slog.SetDefault(log)
	log.Info("Hello from tglinked server!")

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()
	ctx = slogx.NewCtx(ctx, log)

	pgConfig := cfg.PGXConfig()
	pool, err := pgxpool.NewWithConfig(ctx, pgConfig)
	if err != nil {
		log.Error("can't create new database pool")
		os.Exit(1)
	}
	defer pool.Close()

	tgbot, err := bot.New(cfg.TG.BotToken)
	if err != nil {
		log.Error("can't create new telegram bot")
		os.Exit(1)
	}

	s := rest.NewServer(ctx, cfg, usecase.Setup(ctx, cfg, pool, tgbot))
	if err := s.Run(ctx); err != nil && !errors.Is(err, http.ErrServerClosed) {
		slogx.WithErr(log, err).Error("error during server shutdown")
	}
}
