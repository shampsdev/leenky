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

	// cache is map[string]*chatIndex
	indexesCache  sync.Map
	cacheLifetime time.Duration
	cleanupPeriod time.Duration
}

type chatIndex struct {
	createdAt time.Time
	index     bleve.Index
	users     map[string]*domain.User
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

	index, err := s.getChatIndex(ctx, chatID)
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

func (i *chatIndex) Search(req *bleve.SearchRequest) ([]*domain.User, error) {
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

func (s *Search) buildSearchRequest(text string) *bleve.SearchRequest {
	prefixQuery := bleve.NewPrefixQuery(text)

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

func (s *Search) loadFromCache(chatID string) (*chatIndex, bool) {
	i, ok := s.indexesCache.Load(chatID)
	if !ok {
		return nil, false
	}
	index, _ := i.(*chatIndex)
	if time.Since(index.createdAt) > s.cacheLifetime {
		s.indexesCache.Delete(chatID)
		return nil, false
	}

	return index, true
}

func (s *Search) getChatIndex(ctx Context, chatID string) (*chatIndex, error) {
	index, ok := s.loadFromCache(chatID)
	if ok {
		return index, nil
	}

	users, err := s.chatCase.GetChatUsers(ctx, chatID)
	if err != nil {
		return nil, fmt.Errorf("failed to get chat users: %w", err)
	}
	newIndex, err := s.buildChatIndex(users)
	if err != nil {
		return nil, fmt.Errorf("failed to build index: %w", err)
	}
	s.indexesCache.Store(chatID, newIndex)

	return newIndex, nil
}

func (s *Search) buildChatIndex(users []*domain.User) (*chatIndex, error) {
	index, err := bleve.NewMemOnly(bleve.NewIndexMapping())
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

	return &chatIndex{
		createdAt: time.Now(),
		index:     index,
		users:     usersMap,
	}, nil
}

func (s *Search) cacheCleaner() {
	for {
		time.Sleep(s.cacheLifetime)
		s.indexesCache.Range(func(key, value interface{}) bool {
			index, _ := value.(*chatIndex)
			if time.Since(index.createdAt) > time.Hour {
				s.indexesCache.Delete(key)
			}
			return true
		})
	}
}
