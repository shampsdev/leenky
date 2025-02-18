package usecase

import (
	"context"
	"fmt"

	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/repo"
)

type User struct {
	userRepo repo.User
	chatRepo repo.Chat
}

func NewUser(userRepo repo.User, chatRepo repo.Chat) *User {
	return &User{
		userRepo: userRepo,
		chatRepo: chatRepo,
	}
}

func (u *User) GetUserByID(ctx Context, id string) (*domain.User, error) {
	share, err := u.chatRepo.AreUsersShareSameChat(ctx, []string{ctx.User.ID, id})
	if err != nil {
		return nil, err
	}
	if !share {
		return nil, fmt.Errorf("users are not in the same chat")
	}
	return u.userRepo.GetUserByID(ctx, id)
}

func (u *User) GetUserByTelegramID(ctx context.Context, tgID int64) (*domain.User, error) {
	return u.userRepo.GetUserByTelegramID(ctx, tgID)
}

func (u *User) UpdateUser(ctx Context, user *domain.User) (*domain.User, error) {
	if user.ID != ctx.User.ID {
		return nil, fmt.Errorf("can't edit other user")
	}

	return u.userRepo.UpdateUser(ctx, user)
}

func (u *User) CreateUser(ctx Context, user *domain.User) error {
	user.TelegramID = ctx.User.TelegramID
	return u.userRepo.CreateUser(ctx, user)
}
