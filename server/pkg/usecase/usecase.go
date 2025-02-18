package usecase

import (
	"github.com/go-telegram/bot"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/tglinked/server/pkg/repo/pg"
)

type Cases struct {
	Chat *Chat
	User *User
}

func Setup(db *pgxpool.Pool, b *bot.Bot) Cases {
	cr := pg.NewChatRepo(db)
	ur := pg.NewUserRepo(db)
	return Cases{
		Chat: NewChat(cr, b),
		User: NewUser(ur, cr),
	}
}
