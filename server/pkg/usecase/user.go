package usecase

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/go-telegram/bot"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/repo"
	"github.com/shampsdev/tglinked/server/pkg/usecase/names"
)

type User struct {
	userRepo repo.User
	chatRepo repo.Chat
	storage  repo.ImageStorage
	bot      *bot.Bot

	tgDataCache sync.Map
}

func NewUser(
	ctx context.Context,
	userRepo repo.User,
	chatRepo repo.Chat,
	storage repo.ImageStorage,
	tgbot *bot.Bot,
) *User {
	u := &User{
		userRepo: userRepo,
		chatRepo: chatRepo,
		storage:  storage,
		bot:      tgbot,
	}

	go u.cacheCleaner(ctx)
	return u
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

func (u *User) GetUserByTGData(ctx context.Context, tgData *domain.UserTGData) (*domain.User, error) {
	if u, ok := u.tgDataCache.Load(tgData.TelegramID); ok {
		//nolint:errcheck// because sure
		return u.(*domain.User), nil
	}

	user, err := u.userRepo.GetUserByTelegramID(ctx, tgData.TelegramID)
	if err != nil {
		return nil, err
	}

	needUpdate := false
	if tgData.TelegramUsername != user.TelegramUsername {
		needUpdate = true
	}

	// if avatar changed
	if !strings.Contains(user.Avatar, names.ForUserAvatar(user.TelegramID, tgData.Avatar)) {
		var err error
		tgData.Avatar, err = u.storage.SaveImageByURL(ctx, tgData.Avatar, names.ForUserAvatar(user.TelegramID, tgData.Avatar))
		if err != nil {
			return nil, fmt.Errorf("failed to upload user avatar: %w", err)
		}
		needUpdate = true
	}

	if needUpdate {
		user, err = u.userRepo.UpdateUserTGData(ctx, user.ID, tgData)
		if err != nil {
			return nil, fmt.Errorf("failed to update user: %w", err)
		}
	}

	u.tgDataCache.Store(tgData.TelegramID, user)
	return user, nil
}

func (u *User) UpdateUser(ctx Context, id string, user *domain.EditUser) (*domain.User, error) {
	return u.userRepo.UpdateUser(ctx, id, user)
}

func (u *User) DeleteUser(ctx Context) error {
	return u.userRepo.DeleteUser(ctx, ctx.User.ID)
}

func (u *User) CreateUser(ctx Context, editUser *domain.EditUser) (*domain.User, error) {
	user := &domain.User{
		// tgID, tgUsername, avatar are supposed to be injected by auth middleware
		TelegramID:       ctx.User.TelegramID,
		TelegramUsername: ctx.User.TelegramUsername,
		Avatar:           ctx.User.Avatar,
		FirstName:        editUser.FirstName,
		LastName:         editUser.LastName,
		Company:          editUser.Company,
		Role:             editUser.Role,
		Bio:              editUser.Bio,
	}

	var err error
	user.Avatar, err = u.storage.SaveImageByURL(ctx, user.Avatar, names.ForUserAvatar(user.TelegramID, user.Avatar))
	if err != nil {
		return nil, fmt.Errorf("failed to upload user avatar: %w", err)
	}

	id, err := u.userRepo.CreateUser(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}
	user.ID = id
	return user, nil
}

func (u *User) GetMePreview(ctx context.Context, tgData *domain.UserTGData) (*domain.UserPreview, error) {
	up := &domain.UserPreview{
		TelegramID:       tgData.TelegramID,
		TelegramUsername: tgData.TelegramUsername,
		Avatar:           tgData.Avatar,
		FirstName:        tgData.FirstName,
		LastName:         tgData.LastName,
		Bio:              "",
	}

	bio, err := u.determineUserBio(up.TelegramUsername)
	if err != nil {
		return nil, fmt.Errorf("failed to determine user bio: %w", err)
	}
	up.Bio = bio

	_, err = u.userRepo.GetUserByTelegramID(ctx, up.TelegramID)
	if err != nil && !errors.Is(err, repo.ErrUserNotFound) {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	if err == nil {
		up.IsRegistered = true
	}

	return up, nil
}

func (u *User) determineUserBio(username string) (string, error) {
	url := fmt.Sprintf("https://t.me/%s", username)
	resp, err := http.Get(url)
	if err != nil {
		return "", fmt.Errorf("failed to get user bio: %w", err)
	}
	defer resp.Body.Close()

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to parse user bio: %w", err)
	}

	bio := doc.Find("div.tgme_page_description").First().Text()
	return bio, nil
}

func (u *User) cacheCleaner(ctx context.Context) {
	ticker := time.NewTicker(2 * time.Minute)
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			u.tgDataCache.Range(func(key, _ any) bool {
				u.tgDataCache.Delete(key)
				return true
			})
		}
	}
}
