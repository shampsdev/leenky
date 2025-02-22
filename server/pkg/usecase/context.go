package usecase

import (
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"golang.org/x/net/context"
)

type Context struct {
	context.Context
	User *domain.User
}

func NewContext(ctx context.Context, user *domain.User) Context {
	return Context{
		Context: ctx,
		User:    user,
	}
}
