package domain

type User struct {
	ID               string `json:"id"`
	TelegramID       int64  `json:"telegramId"`
	TelegramUsername string `json:"telegramUsername"`

	Avatar    string `json:"avatar"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Company   string `json:"company"`
	Role      string `json:"role"`
	Bio       string `json:"bio"`
}

type EditUser struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Company   string `json:"company"`
	Role      string `json:"role"`
	Bio       string `json:"bio"`
}

type UserTGData struct {
	TelegramID       int64  `json:"telegramId"`
	TelegramUsername string `json:"telegramUsername"`
	Avatar           string `json:"avatar"`
}
