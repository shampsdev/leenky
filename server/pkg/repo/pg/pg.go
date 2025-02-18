package pg

import "github.com/shampsdev/tglinked/server/pkg/repo"

// to ensure pg implement the repo interfaces
var (
	_ repo.User = &UserRepo{}
	_ repo.Chat = &ChatRepo{}
)
