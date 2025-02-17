package repo

import (
	"context"

	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/repo/pg"
)

type Chat interface {
	CreateChat(ctx context.Context, chat *domain.Chat) error
	GetChatByID(ctx context.Context, id string) (*domain.Chat, error)
	GetChatsForUser(ctx context.Context, userID string) ([]*domain.Chat, error)
	SetChatUsers(ctx context.Context, chatID string, userIDs []string) error
	GetChatUsers(ctx context.Context, chatID string) ([]*domain.User, error)
	IsUserInChat(ctx context.Context, userID, chatID string) (bool, error)
}

type User interface {
	CreateUser(ctx context.Context, user *domain.User) error
	UpdateUser(ctx context.Context, user *domain.User) error
	GetUserByID(ctx context.Context, id string) (*domain.User, error)
	GetUserByTelegramID(ctx context.Context, telegramID int64) (*domain.User, error)
}

// ensure that pg repos implement the interfaces
var _ User = &pg.UserRepo{}
var _ Chat = &pg.ChatRepo{}
