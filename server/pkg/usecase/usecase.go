package usecase

import (
	"context"

	"github.com/go-telegram/bot"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/tglinked/server/cmd/config"
	"github.com/shampsdev/tglinked/server/pkg/repo/pg"
	"github.com/shampsdev/tglinked/server/pkg/repo/s3"
)

type Cases struct {
	Community *Community
	User      *User
	Search    *Search
}

func Setup(ctx context.Context, cfg *config.Config, db *pgxpool.Pool, b *bot.Bot) Cases {
	communityRepo := pg.NewCommunityRepo(db)
	userRepo := pg.NewUserRepo(db)
	memberRepo := pg.NewMemberRepo(db)
	storage, err := s3.NewStorage(cfg.S3)
	if err != nil {
		panic(err)
	}
	communityCase := NewCommunity(communityRepo, memberRepo, userRepo, b, storage)
	userCase := NewUser(ctx, userRepo, communityRepo, memberRepo, storage, b)
	searchCase := NewSearch(communityCase)

	return Cases{
		Community: communityCase,
		User:      userCase,
		Search:    searchCase,
	}
}
