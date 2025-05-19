package domain

type UserProfile struct {
	User    *User     `json:"user"`
	Members []*Member `json:"members"`
}

type Member struct {
	User      *User         `json:"user"`
	Community *Community    `json:"community"`
	IsAdmin   bool          `json:"isAdmin"`
	Config    *MemberConfig `json:"config"`
}

type MemberConfig struct {
	// title to field
	Fields map[string]FieldValue `json:"fields"`
}

type CreateMember struct {
	UserID      string        `json:"userId"`
	CommunityID string        `json:"communityId"`
	IsAdmin     bool          `json:"isAdmin"`
	Config      *MemberConfig `json:"config"`
}

type PatchMember struct {
	UserID      string        `json:"userId"`
	CommunityID string        `json:"id"`
	IsAdmin     *bool         `json:"isAdmin"`
	Config      *MemberConfig `json:"config"`
}

type FilterMember struct {
	CommunityID *string `json:"communityId"`
	UserID      *string `json:"userId"`
	IsAdmin     *bool   `json:"isAdmin"`

	IncludeCommunity bool `json:"includeCommunity"`
	IncludeUser      bool `json:"includeUser"`
}
