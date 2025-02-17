package usecase

import (
	"context"

	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/repo"
)

type User struct {
	userRepo repo.User
}

func (u *User) GetUserByID(ctx context.Context, id string) (*domain.User, error) {
	return u.userRepo.GetUserByID(ctx, id)
}
