package usecase

import (
	"github.com/go-telegram/bot"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/tglinked/server/cmd/config"
	"github.com/shampsdev/tglinked/server/pkg/repo/pg"
	"github.com/shampsdev/tglinked/server/pkg/repo/s3"
)

type Cases struct {
	Chat *Chat
	User *User
}

func Setup(cfg *config.Config, db *pgxpool.Pool, b *bot.Bot) Cases {
	cr := pg.NewChatRepo(db)
	ur := pg.NewUserRepo(db)
	storage, err := s3.NewStorage(cfg.S3)
	if err != nil {
		panic(err)
	}
	return Cases{
		Chat: NewChat(cr, storage, b),
		User: NewUser(ur, cr, storage, b),
	}
}
