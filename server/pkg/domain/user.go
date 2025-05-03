package domain

type User struct {
	ID string `json:"id"`
	UserTGData
}

type UserTGData struct {
	TelegramID       int64  `json:"telegramId"`
	TelegramUsername string `json:"telegramUsername"`
	FirstName        string `json:"firstName"`
	LastName         string `json:"lastName"`
	Avatar           string `json:"avatar"`
}

type CreateUser struct {
	UserTGData
}

type PatchMe struct {
	ID        string  `json:"id"`
	FirstName *string `json:"firstName"`
	LastName  *string `json:"lastName"`
}

type PatchUser struct {
	ID               string  `json:"id"`
	FirstName        *string `json:"firstName"`
	LastName         *string `json:"lastName"`
	Avatar           *string `json:"avatar"`
	TelegramUsername *string `json:"telegramUsername"`
}

type FilterUser struct {
	ID         *string `json:"id"`
	TelegramID *int64  `json:"telegramId"`
}

func (pm *PatchMe) ToPatchUser() *PatchUser {
	return &PatchUser{
		ID:        pm.ID,
		FirstName: pm.FirstName,
		LastName:  pm.LastName,
	}
}
