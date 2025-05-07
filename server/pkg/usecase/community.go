package usecase

import (
	"context"
	"errors"
	"fmt"

	"github.com/go-telegram/bot"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/repo"
	"github.com/shampsdev/tglinked/server/pkg/usecase/names"
	"github.com/shampsdev/tglinked/server/pkg/utils/slogx"
)

type Community struct {
	communityRepo repo.Community
	memberRepo    repo.Member
	userRepo      repo.User
	bot           *bot.Bot
	storage       repo.ImageStorage
}

func NewCommunity(communityRepo repo.Community, memberRepo repo.Member, userRepo repo.User, bot *bot.Bot, storage repo.ImageStorage) *Community {
	return &Community{
		communityRepo: communityRepo,
		memberRepo:    memberRepo,
		userRepo:      userRepo,
		bot:           bot,
		storage:       storage,
	}
}

func (c *Community) Create(ctx Context, community *domain.CreateCommunity) (*domain.Community, error) {
	id, err := c.communityRepo.Create(ctx, community)
	if err != nil {
		return nil, fmt.Errorf("failed to create community: %w", err)
	}

	adminMember := &domain.CreateMember{
		UserID:      ctx.User.ID,
		CommunityID: id,
		IsAdmin:     true,
		Config: &domain.MemberConfig{
			Fields: make(map[string]domain.FieldValue),
		},
	}
	if err := c.memberRepo.Create(ctx, adminMember); err != nil {
		return nil, fmt.Errorf("failed to create admin member: %w", err)
	}

	return c.GetByID(ctx, id)
}

func (c *Community) Patch(ctx Context, community *domain.PatchCommunity) (*domain.Community, error) {
	member, err := repo.First(c.memberRepo.Filter)(ctx, &domain.FilterMember{CommunityID: &community.ID, UserID: &ctx.User.ID})
	if err != nil {
		return nil, fmt.Errorf("failed to get member: %w", err)
	}
	if !member.IsAdmin {
		return nil, fmt.Errorf("only admins can patch community")
	}
	err = c.communityRepo.Patch(ctx, community)
	if err != nil {
		return nil, fmt.Errorf("failed to patch community: %w", err)
	}
	return c.GetByID(ctx, community.ID)
}

func (c *Community) GetPreviewByID(ctx Context, id string) (*domain.Community, error) {
	community, err := repo.First(c.communityRepo.Filter)(ctx, &domain.FilterCommunity{ID: &id, IncludeMembersCount: true})
	if err != nil {
		return nil, fmt.Errorf("failed to get community: %w", err)
	}
	isMember, err := c.IsMember(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get member: %w", err)
	}
	community.IsMember = &isMember

	return community, nil
}

func (c *Community) GetPreviews(ctx Context) ([]*domain.Community, error) {
	communities, err := c.communityRepo.Filter(ctx, &domain.FilterCommunity{Members: []string{ctx.User.ID}, IncludeMembersCount: true})
	if err != nil {
		return nil, fmt.Errorf("failed to get communities: %w", err)
	}
	return communities, nil
}

func (c *Community) GetByID(ctx Context, id string) (*domain.Community, error) {
	community, err := repo.First(c.communityRepo.Filter)(ctx, &domain.FilterCommunity{
		ID:      &id,
		Members: []string{ctx.User.ID},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get community: %w", err)
	}
	community.Members, err = c.memberRepo.Filter(ctx, &domain.FilterMember{CommunityID: &id, IncludeUser: true})
	if err != nil {
		return nil, fmt.Errorf("failed to get members: %w", err)
	}
	return community, nil
}

func (c *Community) GetPreviewByTGID(ctx context.Context, tgID int64) (*domain.Community, error) {
	community, err := repo.First(c.communityRepo.Filter)(ctx, &domain.FilterCommunity{TGChatID: &tgID, IncludeMembersCount: true})
	if err != nil {
		return nil, fmt.Errorf("failed to get community: %w", err)
	}
	return community, nil
}

func (c *Community) MigrateTGChatID(ctx context.Context, oldTGID, newTGID int64) error {
	oldCommunity, err := repo.First(c.communityRepo.Filter)(ctx, &domain.FilterCommunity{TGChatID: &oldTGID})
	if err != nil {
		return fmt.Errorf("error getting old chat: %w", err)
	}
	// maybe migrate event was too late and new chat already registered
	newCommunity, err := repo.First(c.communityRepo.Filter)(ctx, &domain.FilterCommunity{TGChatID: &newTGID})

	if err != nil && !errors.Is(err, repo.ErrNotFound) {
		return fmt.Errorf("error getting new chat: %w", err)
	}

	if err == nil {
		slogx.FromCtx(ctx).Warn("Unexpected case, migrate was too late, new chat already registered",
			"old_tg_id", oldTGID, "new_tg_id", newTGID, "old_chat_id", oldCommunity.ID, "new_chat_id", newCommunity.ID)

		err = c.communityRepo.Delete(ctx, newCommunity.ID)
		if err != nil {
			return fmt.Errorf("error deleting community: %w", err)
		}
	} else {
		slogx.FromCtx(ctx).Info("Migrating community tg chat id", "old_tg_id", oldTGID, "new_tg_id", newTGID)
	}

	err = c.communityRepo.Patch(ctx, &domain.PatchCommunity{
		ID:       oldCommunity.ID,
		TGChatID: &newTGID,
	})
	if err != nil {
		return fmt.Errorf("error updating chat: %w", err)
	}
	return nil
}

func (m *Community) JoinCommunity(ctx Context, communityID string, config *domain.MemberConfig) error {
	community, err := m.GetPreviewByID(ctx, communityID)
	if err != nil {
		return fmt.Errorf("error getting community: %w", err)
	}
	err = m.validateConfig(community.Config, config)
	if err != nil {
		return fmt.Errorf("error validating config: %w", err)
	}
	return m.memberRepo.Create(ctx, &domain.CreateMember{
		UserID:      ctx.User.ID,
		CommunityID: communityID,
		IsAdmin:     false,
		Config:      config,
	})
}

func (m *Community) GetMember(ctx Context, communityID, memberID string) (*domain.Member, error) {
	if err := m.ensureUserIsMember(ctx, communityID); err != nil {
		return nil, fmt.Errorf("error ensuring user is member: %w", err)
	}

	member, err := repo.First(m.memberRepo.Filter)(ctx, &domain.FilterMember{
		UserID:      &memberID,
		CommunityID: &communityID,
		IncludeUser: true,
	})
	if err != nil {
		return nil, fmt.Errorf("error getting member: %w", err)
	}
	return member, nil
}

func (m *Community) ensureUserIsMember(ctx Context, communityID string) error {
	_, err := repo.First(m.memberRepo.Filter)(ctx, &domain.FilterMember{
		UserID:      &ctx.User.ID,
		CommunityID: &communityID,
	})
	return err
}

func (m *Community) validateConfig(config *domain.CommunityConfig, filled *domain.MemberConfig) error {
	configFields := make(map[string]*domain.Field)
	for _, f := range config.Fields {
		configFields[f.Title] = f
	}

	for key, field := range filled.Fields {
		configField := configFields[key]
		if configField == nil {
			return fmt.Errorf("field %s not found in config", key)
		}
		if configField.Type != field.Type {
			return fmt.Errorf("field %s type mismatch", key)
		}

		switch field.Type {
		case domain.FieldTypeTextarea:
			if field.Textarea == nil {
				return fmt.Errorf("field %s is required", key)
			}
		case domain.FieldTypeTextinput:
			if field.Textinput == nil {
				return fmt.Errorf("field %s is required", key)
			}
		default:
			return fmt.Errorf("field %s type not supported", key)
		}
	}

	return nil
}

func (m *Community) LeaveCommunity(ctx Context, communityID string) error {
	return m.memberRepo.Delete(ctx, ctx.User.ID, communityID)
}

func (m *Community) IsMember(ctx Context, communityID string) (bool, error) {
	_, err := repo.First(m.memberRepo.Filter)(ctx, &domain.FilterMember{
		UserID:      &ctx.User.ID,
		CommunityID: &communityID,
	})
	if errors.Is(err, repo.ErrNotFound) {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, nil
}

func (m *Community) ConnectCommunityWithTGChat(ctx context.Context, actorID int64, communityID string, tgChatID int64) error {
	actor, err := repo.First(m.userRepo.Filter)(ctx, &domain.FilterUser{
		TelegramID: &actorID,
	})
	if err != nil {
		return fmt.Errorf("error getting actor: %w", err)
	}

	_, err = repo.First(m.memberRepo.Filter)(ctx, &domain.FilterMember{
		CommunityID: &communityID,
		UserID:      &actor.ID,
		IsAdmin:     ptrTo(true),
	})
	if err != nil {
		return fmt.Errorf("error getting admin: %w", err)
	}

	community, err := repo.First(m.communityRepo.Filter)(ctx, &domain.FilterCommunity{
		ID: &communityID,
	})
	if err != nil {
		return fmt.Errorf("error getting community: %w", err)
	}

	tgChat, err := m.bot.GetChat(ctx, &bot.GetChatParams{
		ChatID: tgChatID,
	})
	if err != nil {
		return fmt.Errorf("error getting chat: %w", err)
	}

	community.TGChatID = &tgChatID
	if tgChat.Photo != nil {
		community.Avatar, err = m.downloadTGChatAvatar(ctx, m.bot, m.storage, tgChat.Photo.SmallFileID, tgChatID)
	}
	if err != nil {
		return fmt.Errorf("error downloading avatar: %w", err)
	}

	err = m.communityRepo.Patch(ctx, &domain.PatchCommunity{
		ID:       communityID,
		TGChatID: &tgChatID,
		Avatar:   &community.Avatar,
	})
	if err != nil {
		return fmt.Errorf("error updating community: %w", err)
	}
	return nil
}

func (c *Community) downloadTGChatAvatar(ctx context.Context, b *bot.Bot, s repo.ImageStorage, fileID string, tgID int64) (string, error) {
	file, err := b.GetFile(ctx, &bot.GetFileParams{
		FileID: fileID,
	})
	if err != nil {
		return "", fmt.Errorf("error getting file: %w", err)
	}

	url, err := s.SaveImageByURL(
		ctx,
		b.FileDownloadLink(file),
		names.ForChatAvatar(tgID, fileID),
	)
	if err != nil {
		return "", fmt.Errorf("failed to save photo: %w", err)
	}

	return url, nil
}

func ptrTo[T any](t T) *T {
	return &t
}
