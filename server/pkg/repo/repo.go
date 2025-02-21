package repo

import (
	"context"

	"github.com/shampsdev/tglinked/server/pkg/domain"
)

type Chat interface {
	CreateChat(ctx context.Context, chat *domain.Chat) (string, error)
	UpdateChat(ctx context.Context, chat *domain.Chat) (*domain.Chat, error)
	GetChatByID(ctx context.Context, id string) (*domain.Chat, error)
	GetChatPreviewByID(ctx context.Context, id string) (*domain.ChatPreview, error)
	GetChatByTelegramID(ctx context.Context, telegramID int64) (*domain.Chat, error)
	GetChatsWithUser(ctx context.Context, userID string) ([]*domain.Chat, error)
	SetChatUsers(ctx context.Context, chatID string, userIDs []string) error
	GetChatUsers(ctx context.Context, chatID string) ([]*domain.User, error)
	AttachUserToChat(ctx context.Context, chatID, userID string) error
	DetachUserFromChat(ctx context.Context, chatID, userID string) error
	IsUserInChat(ctx context.Context, userID, chatID string) (bool, error)
	AreUsersShareSameChat(ctx context.Context, userIDs []string) (bool, error)
}

type User interface {
	CreateUser(ctx context.Context, user *domain.User) (string, error)
	UpdateUser(ctx context.Context, id string, user *domain.EditUser) (*domain.User, error)
	GetUserByID(ctx context.Context, id string) (*domain.User, error)
	GetUserByTelegramID(ctx context.Context, telegramID int64) (*domain.User, error)
}

type ImageStorage interface {
	SavePhoto(ctx context.Context, url string) (string, error)
}
