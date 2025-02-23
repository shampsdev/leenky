package domain

import "time"

type Chat struct {
	ID         string  `json:"id"`
	TelegramID int64   `json:"telegramId"`
	Name       string  `json:"name"`
	Avatar     string  `json:"avatar"`
	Users      []*User `json:"users"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type ChatPreview struct {
	ID          string `json:"id"`
	TelegramID  int64  `json:"telegramId"`
	Name        string `json:"name"`
	Avatar      string `json:"avatar"`
	UsersAmount int    `json:"usersAmount"`
}
