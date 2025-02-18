package domain

type Chat struct {
	ID         string  `json:"id"`
	TelegramID int64   `json:"telegram_id"`
	Name       string  `json:"name"`
	Avatar     string  `json:"avatar"`
	Users      []*User `json:"users"`
}
