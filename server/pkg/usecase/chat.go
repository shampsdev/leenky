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
	userRepo repo.User
	bot      *bot.Bot
	storage  repo.ImageStorage
}

func NewChat(chatRepo repo.Chat, userRepo repo.User, s repo.ImageStorage, tgbot *bot.Bot) *Chat {
	return &Chat{
		chatRepo: chatRepo,
		userRepo: userRepo,
		bot:      tgbot,
		storage:  s,
	}
}

func (c *Chat) GetChat(ctx Context, chatID string) (*domain.Chat, error) {
	if err := c.ensureUserInChat(ctx, chatID); err != nil {
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

func (c *Chat) GetChatPreview(ctx context.Context, userTGID int64, chatID string) (*domain.ChatPreview, error) {
	cp, err := c.chatRepo.GetChatPreviewByID(ctx, chatID)
	if err != nil {
		return nil, fmt.Errorf("error getting chat preview: %w", err)
	}
	if err := c.ensureUserInTGChat(ctx, userTGID, cp.TelegramID); err != nil {
		return nil, fmt.Errorf("error ensuring user in chat: %w", err)
	}
	return cp, nil
}

func (c *Chat) GetChatsPreview(ctx Context) ([]*domain.ChatPreview, error) {
	return c.chatRepo.GetChatPreviewsWithUser(ctx, ctx.User.ID)
}

func (c *Chat) GetChatUsers(ctx Context, chatID string) ([]*domain.User, error) {
	if err := c.ensureUserInChat(ctx, chatID); err != nil {
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
	if err := c.ensureUserInChat(ctx, chatID); err != nil {
		return err
	}
	return c.chatRepo.DetachUserFromChat(ctx, chatID, ctx.User.ID)
}

func (c *Chat) CreateOrUpdateChat(ctx context.Context, chatID int64) (*domain.Chat, error) {
	ch, err := c.chatRepo.GetChatByTelegramID(ctx, chatID)
	if errors.Is(err, repo.ErrChatNotFound) {
		return c.CreateChat(ctx, chatID)
	}
	if err != nil {
		return nil, fmt.Errorf("error getting chat by telegram ID: %w", err)
	}
	return c.UpdateChat(ctx, ch.ID, chatID)
}

func (c *Chat) UpdateChat(ctx context.Context, chatID string, tgChatID int64) (*domain.Chat, error) {
	chat, err := c.getChatFromTelegram(ctx, tgChatID)
	if err != nil {
		return nil, fmt.Errorf("error getting chat from telegram: %w", err)
	}
	chat.ID = chatID
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

func (c *Chat) ForgetChatByTGID(ctx context.Context, chatID int64) error {
	chat, err := c.chatRepo.GetChatByTelegramID(ctx, chatID)
	if err != nil {
		return fmt.Errorf("error getting chat: %w", err)
	}
	return c.chatRepo.DeleteChat(ctx, chat.ID)
}

func (c *Chat) getChatFromTelegram(ctx context.Context, chatID int64) (*domain.Chat, error) {
	tgchat, err := c.bot.GetChat(ctx, &bot.GetChatParams{
		ChatID: chatID,
	})
	if err != nil {
		return nil, fmt.Errorf("error getting chat: %w", err)
	}
	avatar := ""
	if tgchat.Photo != nil {
		avatar, err = downloadTGFileByID(ctx, c.bot, c.storage, tgchat.Photo.SmallFileID)
	}
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

func (c *Chat) ensureUserInTGChat(ctx context.Context, userID, chatID int64) error {
	_, err := c.bot.GetChatMember(ctx, &bot.GetChatMemberParams{
		ChatID: chatID,
		UserID: userID,
	})
	if err != nil {
		return fmt.Errorf("error getting chat member: %w", err)
	}
	return nil
}

func (c *Chat) ensureUserInChat(ctx Context, chatID string) error {
	inChat, err := c.chatRepo.IsUserInChat(ctx, ctx.User.ID, chatID)
	if err != nil {
		return fmt.Errorf("error checking if user is in chat: %w", err)
	}
	if !inChat {
		return fmt.Errorf("user is not in chat")
	}

	tgID, err := c.chatRepo.GetChatTelegramIDByID(ctx, chatID)
	if err != nil {
		return fmt.Errorf("error getting chat preview: %w", err)
	}
	if err := c.ensureUserInTGChat(ctx, ctx.User.TelegramID, tgID); err != nil {
		return fmt.Errorf("error checking if user is in tg chat: %w", err)
	}

	return nil
}

func (c *Chat) DetachUserFromChat(ctx context.Context, chatTGID, userTGID int64) error {
	chatID, err := c.chatRepo.GetChatIDByTelegramID(ctx, chatTGID)
	if err != nil {
		return fmt.Errorf("error getting chat ID: %w", err)
	}
	userID, err := c.userRepo.GetUserIDByTelegramID(ctx, userTGID)
	if err != nil {
		return fmt.Errorf("error getting user ID: %w", err)
	}
	return c.chatRepo.DetachUserFromChat(ctx, chatID, userID)
}

func downloadTGFileByID(ctx context.Context, b *bot.Bot, s repo.ImageStorage, fileID string) (string, error) {
	file, err := b.GetFile(ctx, &bot.GetFileParams{
		FileID: fileID,
	})
	if err != nil {
		return "", fmt.Errorf("error getting file: %w", err)
	}

	url, err := s.SaveImageByURL(ctx, b.FileDownloadLink(file))
	if err != nil {
		return "", fmt.Errorf("failed to save photo: %w", err)
	}

	return url, nil
}
