package usecase

import (
	"github.com/go-telegram/bot"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/tglinked/server/cmd/config"
	"github.com/shampsdev/tglinked/server/pkg/repo/pg"
	"github.com/shampsdev/tglinked/server/pkg/repo/s3"
)

type Cases struct {
	Chat   *Chat
	User   *User
	Search *Search
}

func Setup(cfg *config.Config, db *pgxpool.Pool, b *bot.Bot) Cases {
	chatRepo := pg.NewChatRepo(db)
	userRepo := pg.NewUserRepo(db)
	storage, err := s3.NewStorage(cfg.S3)
	if err != nil {
		panic(err)
	}
	chatCase := NewChat(chatRepo, storage, b)
	userCase := NewUser(userRepo, chatRepo, storage, b)
	searchCase := NewSearch(chatCase)

	return Cases{
		Chat:   chatCase,
		User:   userCase,
		Search: searchCase,
	}
}
