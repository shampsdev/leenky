package repo

import (
	"context"

	"github.com/shampsdev/tglinked/server/pkg/domain"
)

type Chat interface {
	CreateChat(ctx context.Context, chat *domain.Chat) (string, error)
	UpdateChat(ctx context.Context, chat *domain.Chat) (*domain.Chat, error)
	DeleteChat(ctx context.Context, id string) error
	GetChatByID(ctx context.Context, id string) (*domain.Chat, error)
	GetChatIDByTelegramID(ctx context.Context, telegramID int64) (string, error)
	GetChatTelegramIDByID(ctx context.Context, id string) (int64, error)
	GetChatPreviewByID(ctx context.Context, id string) (*domain.ChatPreview, error)
	GetChatByTelegramID(ctx context.Context, telegramID int64) (*domain.Chat, error)
	GetChatPreviewsWithUser(ctx context.Context, userID string) ([]*domain.ChatPreview, error)
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
	UpdateUserTGData(ctx context.Context, id string, user *domain.UserTGData) (*domain.User, error)
	DeleteUser(ctx context.Context, id string) error
	GetUserByID(ctx context.Context, id string) (*domain.User, error)
	GetUserByTelegramID(ctx context.Context, telegramID int64) (*domain.User, error)
	GetUserIDByTelegramID(ctx context.Context, telegramID int64) (string, error)
}

type ImageStorage interface {
	SaveImageByURL(ctx context.Context, url string) (string, error)
}
