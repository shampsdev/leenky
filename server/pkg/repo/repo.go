package repo

import (
	"context"

	"github.com/shampsdev/tglinked/server/pkg/domain"
)

type Community interface {
	Create(ctx context.Context, community *domain.CreateCommunity) (string, error)
	Patch(ctx context.Context, community *domain.PatchCommunity) error
	Filter(ctx context.Context, filter *domain.FilterCommunity) ([]*domain.Community, error)
	Delete(ctx context.Context, id string) error
}

type User interface {
	Create(ctx context.Context, user *domain.CreateUser) (string, error)
	Patch(ctx context.Context, user *domain.PatchUser) error
	Filter(ctx context.Context, filter *domain.FilterUser) ([]*domain.User, error)
	Delete(ctx context.Context, id string) error
}

type Member interface {
	Create(ctx context.Context, member *domain.CreateMember) error
	Patch(ctx context.Context, member *domain.PatchMember) error
	Filter(ctx context.Context, filter *domain.FilterMember) ([]*domain.Member, error)
	Delete(ctx context.Context, userID, communityID string) error
}

type ImageStorage interface {
	SaveImageByURL(ctx context.Context, url, key string) (string, error)
	SaveImageByBytes(ctx context.Context, bytes []byte, key string) (string, error)
}
