package usecase

import (
	"context"
	"fmt"

	"github.com/go-telegram/bot"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/repo"
)

type User struct {
	userRepo repo.User
	chatRepo repo.Chat
	storage  repo.ImageStorage
	bot      *bot.Bot
}

func NewUser(
	userRepo repo.User,
	chatRepo repo.Chat,
	storage repo.ImageStorage,
	tgbot *bot.Bot,
) *User {
	return &User{
		userRepo: userRepo,
		chatRepo: chatRepo,
		storage:  storage,
		bot:      tgbot,
	}
}

func (u *User) GetMe(ctx Context) (*domain.User, error) {
	return u.userRepo.GetUserByID(ctx, ctx.User.ID)
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

func (u *User) UpdateUser(ctx Context, id string, user *domain.EditUser) (*domain.User, error) {
	return u.userRepo.UpdateUser(ctx, id, user)
}

func (u *User) CreateUser(ctx Context, editUser *domain.EditUser) (*domain.User, error) {
	tguser, err := u.bot.GetChat(ctx, &bot.GetChatParams{
		ChatID: ctx.User.TelegramID,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get user from chat: %w", err)
	}

	avatar := ""
	if tguser.Photo != nil {
		avatar, err = downloadTGFileByID(ctx, u.bot, u.storage, tguser.Photo.SmallFileID)
		if err != nil {
			return nil, fmt.Errorf("failed to download user avatar: %w", err)
		}
	}

	user := &domain.User{
		TelegramID:       ctx.User.TelegramID,
		TelegramUsername: tguser.Username,
		Avatar:           avatar,
		FirstName:        editUser.FirstName,
		LastName:         editUser.LastName,
		Company:          editUser.Company,
		Role:             editUser.Role,
		Bio:              editUser.Bio,
	}

	id, err := u.userRepo.CreateUser(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}
	user.ID = id
	return user, nil
}
