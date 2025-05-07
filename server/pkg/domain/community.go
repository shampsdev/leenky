package domain

type Community struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Avatar      string `json:"avatar"`

	TGChatID *int64 `json:"tgChatID"`

	Config  *CommunityConfig `json:"config"`
	Members []*Member        `json:"members,omitempty"`

	MembersCount *int  `json:"membersCount,omitempty"`
	IsMember     *bool `json:"isMember,omitempty"`
}

type CommunityConfig struct {
	Fields []*Field `json:"fields"`
}

type CreateCommunity struct {
	Name        string           `json:"name"`
	Description string           `json:"description"`
	Avatar      string           `json:"avatar"`
	Config      *CommunityConfig `json:"config"`
}

type PatchCommunity struct {
	ID          string           `json:"id"`
	Name        *string          `json:"name"`
	Description *string          `json:"description"`
	Avatar      *string          `json:"avatar"`
	TGChatID    *int64           `json:"tgChatID"`
	Config      *CommunityConfig `json:"config"`
}

type FilterCommunity struct {
	ID       *string  `json:"id"`
	TGChatID *int64   `json:"tgChatID"`
	Members  []string `json:"members"`

	IncludeMembersCount bool `json:"includeMembersCount"`
}
