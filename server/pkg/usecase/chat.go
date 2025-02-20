package usecase

import (
	"context"
	"errors"
	"fmt"

	"github.com/go-telegram/bot"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/repo"
)

type Chat struct {
	chatRepo repo.Chat
	tgbot    *bot.Bot
}

func NewChat(chatRepo repo.Chat, tgbot *bot.Bot) *Chat {
	return &Chat{
		chatRepo: chatRepo,
		tgbot:    tgbot,
	}
}

func (c *Chat) GetChat(ctx Context, chatID string) (*domain.Chat, error) {
	if err := c.ensureUserInChat(ctx, ctx.User.ID, chatID); err != nil {
		return nil, err
	}

	chat, err := c.chatRepo.GetChatByID(ctx, chatID)
	if err != nil {
		return nil, fmt.Errorf("error getting chat: %w", err)
	}
	chat.Users, err = c.chatRepo.GetChatUsers(ctx, chatID)
	if err != nil {
		return nil, fmt.Errorf("error getting chat users: %w", err)
	}
	return chat, nil
}

func (c *Chat) GetChats(ctx Context) ([]*domain.Chat, error) {
	return c.chatRepo.GetChatsWithUser(ctx, ctx.User.ID)
}

func (c *Chat) GetChatUsers(ctx Context, chatID string) ([]*domain.User, error) {
	if err := c.ensureUserInChat(ctx, ctx.User.ID, chatID); err != nil {
		return nil, err
	}
	return c.chatRepo.GetChatUsers(ctx, chatID)
}

func (c *Chat) JoinChat(ctx Context, chatID string) error {
	chat, err := c.chatRepo.GetChatByID(ctx, chatID)
	if err != nil {
		return fmt.Errorf("error getting chat: %w", err)
	}
	_, err = c.tgbot.GetChatMember(ctx, &bot.GetChatMemberParams{
		ChatID: chat.TelegramID,
		UserID: ctx.User.TelegramID,
	})
	if err != nil {
		return fmt.Errorf("error getting chat member: %w", err)
	}

	err = c.chatRepo.AttachUserToChat(ctx, chatID, ctx.User.ID)
	if err != nil {
		return fmt.Errorf("error attaching user to chat: %w", err)
	}
	return nil
}

func (c *Chat) LeaveChat(ctx Context, chatID string) error {
	if err := c.ensureUserInChat(ctx, ctx.User.ID, chatID); err != nil {
		return err
	}
	return c.chatRepo.DetachUserFromChat(ctx, chatID, ctx.User.ID)
}

func (c *Chat) RegisterChat(ctx context.Context, chat *domain.Chat) (*domain.Chat, error) {
	ch, err := c.chatRepo.GetChatByTelegramID(ctx, chat.TelegramID)
	if errors.Is(err, repo.ErrChatNotFound) {
		id, err := c.chatRepo.CreateChat(ctx, chat)
		if err != nil {
			return nil, fmt.Errorf("error creating chat: %w", err)
		}
		chat.ID = id
		return chat, nil
	}
	if err != nil {
		return nil, fmt.Errorf("error getting chat by telegram ID: %w", err)
	}
	chat.ID = ch.ID
	_, err = c.chatRepo.UpdateChat(ctx, chat)
	if err != nil {
		return nil, fmt.Errorf("error updating chat: %w", err)
	}
	return chat, nil
}

func (c *Chat) ensureUserInChat(ctx context.Context, userID, chatID string) error {
	inChat, err := c.chatRepo.IsUserInChat(ctx, userID, chatID)
	if err != nil {
		return fmt.Errorf("error checking if user is in chat: %w", err)
	}
	if !inChat {
		return fmt.Errorf("user is not in chat")
	}
	return nil
}
