package usecase

import (
	"context"
	"fmt"

	"github.com/go-telegram/bot"
	"github.com/go-telegram/bot/models"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/repo"
)

type User struct {
	userRepo repo.User
	chatRepo repo.Chat
	storage  repo.ImageStorage
	tgbot    *bot.Bot
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
		tgbot:    tgbot,
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

func (u *User) UpdateUser(ctx Context, id string, user *domain.EditUser) (*domain.User, error) {
	return u.userRepo.UpdateUser(ctx, id, user)
}

func (u *User) CreateUser(ctx Context, chatID string, editUser *domain.EditUser) (*domain.User, error) {
	chat, err := u.chatRepo.GetChatByID(ctx, chatID)
	if err != nil {
		return nil, fmt.Errorf("failed to get chat: %w", err)
	}

	photos, err := u.tgbot.GetUserProfilePhotos(ctx, &bot.GetUserProfilePhotosParams{
		UserID: ctx.User.TelegramID,
		Limit:  1,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get user photos, %w", err)
	}

	var photoID *string
	for _, photo := range photos.Photos[0] {
		photoID = &photo.FileID
		break
	}

	avatar := ""
	if photoID != nil {
		file, err := u.tgbot.GetFile(ctx, &bot.GetFileParams{
			FileID: *photoID,
		})
		if err != nil {
			return nil, fmt.Errorf("failed to get file: %w", err)
		}

		avatar, err = u.storage.SavePhoto(ctx, u.tgbot.FileDownloadLink(file))
		if err != nil {
			return nil, fmt.Errorf("failed to save photo: %w", err)
		}
	}

	tguser, err := u.getUserFromChat(chat.TelegramID, ctx.User.TelegramID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from chat: %w", err)
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

func (u *User) getUserFromChat(chatID, userID int64) (models.User, error) {
	user, err := u.tgbot.GetChatMember(context.Background(), &bot.GetChatMemberParams{
		ChatID: chatID,
		UserID: userID,
	})
	if err != nil {
		return models.User{}, fmt.Errorf("failed to get user from chat: %w", err)
	}

	if user.Member != nil && user.Member.User != nil {
		return *user.Member.User, nil
	}

	if user.Administrator != nil {
		return user.Administrator.User, nil
	}

	if user.Owner != nil && user.Owner.User != nil {
		return *user.Owner.User, nil
	}

	if user.Restricted != nil && user.Restricted.User != nil {
		return *user.Restricted.User, nil
	}

	return models.User{}, fmt.Errorf("user not found in chat")
}
