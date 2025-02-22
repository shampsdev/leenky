package usecase

import (
	"fmt"
	"sync"
	"time"

	"github.com/blevesearch/bleve/v2"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/utils"
)

type Search struct {
	chatCase *Chat

	// cache is map string -> *usersIndex | *chatsIndex
	indexesCache  sync.Map
	cacheLifetime time.Duration
	cleanupPeriod time.Duration
}

type usersIndex struct {
	createdAt time.Time
	index     bleve.Index
	users     map[string]*domain.User
}

type chatsIndex struct {
	createdAt time.Time
	index     bleve.Index
	chats     map[string]*domain.ChatPreview
}

func NewSearch(chatCase *Chat) *Search {
	s := &Search{
		chatCase:      chatCase,
		cacheLifetime: 30 * time.Second,
		cleanupPeriod: 5 * time.Minute,
	}
	go s.cacheCleaner()
	return s
}

func (s *Search) SearchInChat(ctx Context, chatID, text string) ([]*domain.User, error) {
	if err := s.chatCase.ensureUserInChat(ctx, chatID); err != nil {
		return nil, fmt.Errorf("failed to ensure user in chat: %w", err)
	}

	index, err := s.getUsersIndex(ctx, chatID)
	if err != nil {
		return nil, fmt.Errorf("failed to get chat index: %w", err)
	}

	req := s.buildSearchRequest(text)
	users, err := index.Search(req)
	if err != nil {
		return nil, fmt.Errorf("failed to search index: %w", err)
	}
	return users, nil
}

func (s *Search) SearchChats(ctx Context, text string) ([]*domain.ChatPreview, error) {
	index, err := s.getChatsIndex(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get chat index: %w", err)
	}

	req := s.buildSearchRequest(text)
	chats, err := index.Search(req)
	if err != nil {
		return nil, fmt.Errorf("failed to search index: %w", err)
	}
	return chats, nil
}

func (i *usersIndex) Search(req *bleve.SearchRequest) ([]*domain.User, error) {
	res, err := i.index.Search(req)
	if err != nil {
		return nil, fmt.Errorf("failed to search index: %w", err)
	}

	var users []*domain.User
	for _, hit := range res.Hits {
		users = append(users, i.users[hit.ID])
	}
	return users, nil
}

func (i *chatsIndex) Search(req *bleve.SearchRequest) ([]*domain.ChatPreview, error) {
	res, err := i.index.Search(req)
	if err != nil {
		return nil, fmt.Errorf("failed to search index: %w", err)
	}

	var chats []*domain.ChatPreview
	for _, hit := range res.Hits {
		chats = append(chats, i.chats[hit.ID])
	}
	return chats, nil
}

func (s *Search) buildSearchRequest(text string) *bleve.SearchRequest {
	prefixQuery := bleve.NewMatchQuery(text)

	fuzzyQuery := bleve.NewFuzzyQuery(text)
	fuzzyQuery.Fuzziness = 2
	translitQuery := bleve.NewFuzzyQuery(utils.Transliterate(text))
	translitQuery.Fuzziness = 2

	fieldQuery := bleve.NewMatchQuery(text)

	query := bleve.NewDisjunctionQuery(
		prefixQuery,
		fuzzyQuery,
		translitQuery,
		fieldQuery,
	)
	return bleve.NewSearchRequest(query)
}

func (s *Search) usersIndexFromCache(chatID string) (*usersIndex, bool) {
	i, ok := s.indexesCache.Load(chatID)
	if !ok {
		return nil, false
	}
	index, _ := i.(*usersIndex)
	if time.Since(index.createdAt) > s.cacheLifetime {
		s.indexesCache.Delete(chatID)
		return nil, false
	}

	return index, true
}

func (s *Search) chatsIndexFromCache(chatID string) (*chatsIndex, bool) {
	i, ok := s.indexesCache.Load(chatID)
	if !ok {
		return nil, false
	}
	index, _ := i.(*chatsIndex)
	if time.Since(index.createdAt) > s.cacheLifetime {
		s.indexesCache.Delete(chatID)
		return nil, false
	}

	return index, true
}

func (s *Search) getUsersIndex(ctx Context, chatID string) (*usersIndex, error) {
	index, ok := s.usersIndexFromCache(chatID)
	if ok {
		return index, nil
	}

	users, err := s.chatCase.GetChatUsers(ctx, chatID)
	if err != nil {
		return nil, fmt.Errorf("failed to get chat users: %w", err)
	}
	newIndex, err := s.buildUsersIndex(users)
	if err != nil {
		return nil, fmt.Errorf("failed to build index: %w", err)
	}
	s.indexesCache.Store(chatID, newIndex)

	return newIndex, nil
}

func (s *Search) getChatsIndex(ctx Context) (*chatsIndex, error) {
	index, ok := s.chatsIndexFromCache("chats")
	if ok {
		return index, nil
	}

	chats, err := s.chatCase.chatRepo.GetChatPreviewsWithUser(ctx, ctx.User.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to get chats: %w", err)
	}
	newIndex, err := s.buildChatsIndex(chats)
	if err != nil {
		return nil, fmt.Errorf("failed to build index: %w", err)
	}
	s.indexesCache.Store("chats", newIndex)

	return newIndex, nil
}

func (s *Search) buildUsersIndex(users []*domain.User) (*usersIndex, error) {
	mapping := bleve.NewIndexMapping()
	index, err := bleve.NewMemOnly(mapping)
	if err != nil {
		panic(err)
	}
	for _, user := range users {
		err := index.Index(user.ID, user)
		if err != nil {
			return nil, fmt.Errorf("failed to index user: %w", err)
		}
	}

	usersMap := make(map[string]*domain.User)
	for _, user := range users {
		usersMap[user.ID] = user
	}

	return &usersIndex{
		createdAt: time.Now(),
		index:     index,
		users:     usersMap,
	}, nil
}

func (s *Search) buildChatsIndex(chats []*domain.ChatPreview) (*chatsIndex, error) {
	mapping := bleve.NewIndexMapping()
	index, err := bleve.NewMemOnly(mapping)
	if err != nil {
		panic(err)
	}
	for _, chat := range chats {
		err := index.Index(chat.ID, chat)
		if err != nil {
			return nil, fmt.Errorf("failed to index chat: %w", err)
		}
	}

	chatsMap := make(map[string]*domain.ChatPreview)
	for _, chat := range chats {
		chatsMap[chat.ID] = chat
	}

	return &chatsIndex{
		createdAt: time.Now(),
		index:     index,
		chats:     chatsMap,
	}, nil
}

func (s *Search) cacheCleaner() {
	for {
		time.Sleep(s.cacheLifetime)
		s.indexesCache.Range(func(key, value interface{}) bool {
			switch v := value.(type) {
			case *usersIndex:
				if time.Since(v.createdAt) > s.cacheLifetime {
					s.indexesCache.Delete(key)
				}
			case *chatsIndex:
				if time.Since(v.createdAt) > s.cacheLifetime {
					s.indexesCache.Delete(key)
				}
			}
			return true
		})
	}
}
