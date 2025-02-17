package usecase

import (
	"context"
	"fmt"

	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/repo"
)

type Chat struct {
	chatRepo repo.Chat
}

func (c *Chat) IsUserInChat(ctx context.Context, userID string, chatID string) (bool, error) {
	return c.chatRepo.IsUserInChat(ctx, userID, chatID)
}

func (c *Chat) GetChatByIDForUser(ctx context.Context, userID string, chatID string) (*domain.Chat, error) {
	inChat, err := c.IsUserInChat(ctx, userID, chatID)
	if err != nil {
		return nil, fmt.Errorf("error checking if user is in chat: %w", err)
	}
	if !inChat {
		return nil, fmt.Errorf("user is not in chat")
	}
	return c.chatRepo.GetChatByID(ctx, chatID)
}

func (c *Chat) GetChatsForUser(ctx context.Context, userID string) ([]*domain.Chat, error) {
	return c.chatRepo.GetChatsForUser(ctx, userID)
}

func (c *Chat) GetChatUsers(ctx context.Context, chatID string) ([]*domain.User, error) {
	return c.chatRepo.GetChatUsers(ctx, chatID)
}
