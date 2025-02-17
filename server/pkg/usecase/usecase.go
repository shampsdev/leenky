package usecase

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/tglinked/server/pkg/repo/pg"
)

type Cases struct {
	Chat *Chat
	User *User
}

func Setup(db *pgxpool.Pool) Cases {
	cr := pg.NewChatRepo(db)
	ur := pg.NewUserRepo(db)
	return Cases{
		Chat: &Chat{chatRepo: cr},
		User: &User{userRepo: ur},
	}
}
