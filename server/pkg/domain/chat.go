package domain

type Chat struct {
	ID         string  `json:"id"`
	TelegramID int64   `json:"telegramId"`
	Name       string  `json:"name"`
	Avatar     string  `json:"avatar"`
	Users      []*User `json:"users"`
}

type ChatPreview struct {
	ID          string `json:"id"`
	TelegramID  int64  `json:"telegramId"`
	Name        string `json:"name"`
	Avatar      string `json:"avatar"`
	UsersAmount int    `json:"usersAmount"`
}
