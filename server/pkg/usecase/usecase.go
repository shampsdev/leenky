package usecase

import (
	"github.com/go-telegram/bot"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/tglinked/server/cmd/config"
	"github.com/shampsdev/tglinked/server/pkg/repo/localstorage"
	"github.com/shampsdev/tglinked/server/pkg/repo/pg"
)

type Cases struct {
	Chat *Chat
	User *User
}

func Setup(cfg *config.Config, db *pgxpool.Pool, b *bot.Bot) Cases {
	cr := pg.NewChatRepo(db)
	ur := pg.NewUserRepo(db)
	storage := localstorage.NewStorage(cfg.Server.Host, cfg.Storage.ImagesPath)
	return Cases{
		Chat: NewChat(cr, storage, b),
		User: NewUser(ur, cr, storage, b),
	}
}
