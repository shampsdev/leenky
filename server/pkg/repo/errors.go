package repo

import "errors"

var (
	ErrChatNotFound = errors.New("chat not found")
	ErrUserNotFound = errors.New("user not found")
)
