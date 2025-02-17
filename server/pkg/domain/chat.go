package domain

type Chat struct {
	ID     string  `json:"id"`
	Name   string  `json:"name"`
	Avatar string  `json:"avatar"`
	Users  []*User `json:"users"`
}
