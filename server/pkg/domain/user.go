package domain

type User struct {
	ID         string `json:"id"`
	TelegramID int64  `json:"telegramId"`
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	Company    string `json:"company"`
	Role       string `json:"role"`
	Bio        string `json:"bio"`
}
