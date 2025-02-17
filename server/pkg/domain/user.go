package domain

type User struct {
	ID         string `json:"id"`
	TelegramID string `json:"telegramId"`
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	Company    string `json:"company"`
	Role       string `json:"role"`
	Bio        string `json:"bio"`
}
