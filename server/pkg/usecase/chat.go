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
	bot      *bot.Bot
	storage  repo.ImageStorage
}

func NewChat(chatRepo repo.Chat, s repo.ImageStorage, tgbot *bot.Bot) *Chat {
	return &Chat{
		chatRepo: chatRepo,
		bot:      tgbot,
		storage:  s,
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
	_, err = c.bot.GetChatMember(ctx, &bot.GetChatMemberParams{
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

func (c *Chat) CreateOrUpdateChat(ctx context.Context, chatID int64) (*domain.Chat, error) {
	_, err := c.chatRepo.GetChatByTelegramID(ctx, chatID)
	if errors.Is(err, repo.ErrChatNotFound) {
		return c.CreateChat(ctx, chatID)
	}
	if err != nil {
		return nil, fmt.Errorf("error getting chat by telegram ID: %w", err)
	}
	return c.UpdateChat(ctx, chatID)
}

func (c *Chat) UpdateChat(ctx context.Context, chatID int64) (*domain.Chat, error) {
	chat, err := c.getChatFromTelegram(ctx, chatID)
	if err != nil {
		return nil, fmt.Errorf("error getting chat from telegram: %w", err)
	}
	chat, err = c.chatRepo.UpdateChat(ctx, chat)
	if err != nil {
		return nil, fmt.Errorf("error creating chat: %w", err)
	}
	return chat, nil
}

func (c *Chat) CreateChat(ctx context.Context, chatID int64) (*domain.Chat, error) {
	chat, err := c.getChatFromTelegram(ctx, chatID)
	if err != nil {
		return nil, fmt.Errorf("error getting chat from telegram: %w", err)
	}
	id, err := c.chatRepo.CreateChat(ctx, chat)
	if err != nil {
		return nil, fmt.Errorf("error creating chat: %w", err)
	}
	chat.ID = id
	return chat, nil
}

func (c *Chat) getChatFromTelegram(ctx context.Context, chatID int64) (*domain.Chat, error) {
	tgchat, err := c.bot.GetChat(ctx, &bot.GetChatParams{
		ChatID: chatID,
	})
	if err != nil {
		return nil, fmt.Errorf("error getting chat: %w", err)
	}

	avatar, err := downloadTGFileByID(ctx, c.bot, c.storage, tgchat.Photo.SmallFileID)
	if err != nil {
		return nil, fmt.Errorf("failed to download user avatar: %w", err)
	}

	chat := &domain.Chat{
		TelegramID: tgchat.ID,
		Avatar:     avatar,
		Name:       tgchat.Title,
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

func downloadTGFileByID(ctx context.Context, b *bot.Bot, s repo.ImageStorage, fileID string) (string, error) {
	file, err := b.GetFile(ctx, &bot.GetFileParams{
		FileID: fileID,
	})
	if err != nil {
		return "", fmt.Errorf("error getting file: %w", err)
	}

	url, err := s.SavePhoto(ctx, b.FileDownloadLink(file))
	if err != nil {
		return "", fmt.Errorf("failed to save photo: %w", err)
	}

	return url, nil
}
