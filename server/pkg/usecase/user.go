package usecase

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/go-telegram/bot"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/repo"
	"github.com/shampsdev/tglinked/server/pkg/usecase/names"
	"github.com/shampsdev/tglinked/server/pkg/utils/slogx"
)

type User struct {
	userRepo      repo.User
	communityRepo repo.Community
	memberRepo    repo.Member
	storage       repo.ImageStorage
	bot           *bot.Bot

	tgDataCache sync.Map
}

func NewUser(
	ctx context.Context,
	userRepo repo.User,
	communityRepo repo.Community,
	memberRepo repo.Member,
	storage repo.ImageStorage,
	tgbot *bot.Bot,
) *User {
	u := &User{
		userRepo:      userRepo,
		communityRepo: communityRepo,
		memberRepo:    memberRepo,
		storage:       storage,
		bot:           tgbot,
	}

	go u.cacheCleaner(ctx)
	return u
}

func (u *User) Create(ctx context.Context, userTGData *domain.UserTGData) (*domain.User, error) {
	user := &domain.CreateUser{
		UserTGData: domain.UserTGData{
			TelegramID:       userTGData.TelegramID,
			TelegramUsername: userTGData.TelegramUsername,
			FirstName:        userTGData.FirstName,
			LastName:         userTGData.LastName,
		},
	}

	var err error
	user.Avatar, err = u.storage.SaveImageByURL(ctx, user.Avatar, names.ForUserAvatar(user.TelegramID, user.Avatar))
	if err != nil {
		return nil, fmt.Errorf("failed to upload user avatar: %w", err)
	}

	id, err := u.userRepo.Create(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}
	return repo.First(u.userRepo.Filter)(ctx, &domain.FilterUser{ID: &id})
}

func (u *User) Patch(ctx context.Context, user *domain.PatchUser) (*domain.User, error) {
	err := u.userRepo.Patch(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("failed to patch user: %w", err)
	}
	return repo.First(u.userRepo.Filter)(ctx, &domain.FilterUser{ID: &user.ID})
}

func (u *User) Delete(ctx Context, userID string) error {
	return u.userRepo.Delete(ctx, userID)
}

func (u *User) GetByTGData(ctx context.Context, tgData *domain.UserTGData) (*domain.User, error) {
	if u, ok := u.tgDataCache.Load(tgData.TelegramID); ok {
		//nolint:errcheck// because sure
		return u.(*domain.User), nil
	}

	user, err := repo.First(u.userRepo.Filter)(ctx, &domain.FilterUser{
		TelegramID: &tgData.TelegramID,
	})
	if err != nil {
		return nil, err
	}

	tgData.Avatar, err = u.telegramAvatarLocation(tgData.Avatar)
	if err != nil {
		return nil, fmt.Errorf("failed to get user avatar: %w", err)
	}

	needUpdate := false
	if tgData.TelegramUsername != user.TelegramUsername {
		needUpdate = true
	}

	// if avatar changed
	if !strings.Contains(user.Avatar, names.ForUserAvatar(user.TelegramID, tgData.Avatar)) {
		var err error
		tgData.Avatar, err = u.storage.SaveImageByURL(ctx, tgData.Avatar, names.ForUserAvatar(user.TelegramID, tgData.Avatar))
		user.Avatar = tgData.Avatar
		slogx.FromCtx(ctx).Debug("user avatar changed", "user", user.ID, "old_avatar", user.Avatar, "new_avatar", tgData.Avatar)
		if err != nil {
			return nil, fmt.Errorf("failed to upload user avatar: %w", err)
		}
		needUpdate = true
	}

	if needUpdate {
		err = u.userRepo.Patch(ctx, &domain.PatchUser{
			ID:               user.ID,
			FirstName:        &tgData.FirstName,
			LastName:         &tgData.LastName,
			Avatar:           &user.Avatar,
			TelegramUsername: &tgData.TelegramUsername,
		})
		if err != nil {
			return nil, fmt.Errorf("failed to update user: %w", err)
		}
	}

	u.tgDataCache.Store(tgData.TelegramID, user)
	return user, nil
}

func (u *User) GetMeProfile(ctx Context) (*domain.UserProfile, error) {
	return u.GetProfile(ctx, ctx.User.ID)
}

func (u *User) GetProfile(ctx Context, userID string) (*domain.UserProfile, error) {
	user, err := repo.First(u.userRepo.Filter)(ctx, &domain.FilterUser{ID: &userID})
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	members, err := u.memberRepo.Filter(ctx, &domain.FilterMember{UserID: &userID, IncludeCommunity: true})
	if err != nil {
		return nil, fmt.Errorf("failed to get user members: %w", err)
	}
	for _, member := range members {
		member.User = ctx.User
	}
	return &domain.UserProfile{
		User:    user,
		Members: members,
	}, nil
}

func (u *User) telegramAvatarLocation(userpicURL string) (string, error) {
	httpCli := &http.Client{
		CheckRedirect: func(_ *http.Request, _ []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}
	resp, err := httpCli.Head(userpicURL)
	if err != nil {
		return "", fmt.Errorf("failed to get userpic: %w", err)
	}
	defer resp.Body.Close()

	location := resp.Header.Get("Location")
	if location == "" {
		return userpicURL, nil
	}
	return location, nil
}

func (u *User) cacheCleaner(ctx context.Context) {
	log := slogx.FromCtx(ctx)
	log.Info("userTGData cache cleaner started")
	ticker := time.NewTicker(2 * time.Minute)
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			deleted := atomic.Int64{}
			u.tgDataCache.Range(func(key, _ any) bool {
				u.tgDataCache.Delete(key)
				deleted.Add(1)
				return true
			})
			log.Info("userTGData cache cleaned", "deleted", deleted.Load())
		}
	}
}
