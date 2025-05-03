package usecase

import (
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/blevesearch/bleve/v2"
	"github.com/blevesearch/bleve/v2/analysis/lang/ru"
	"github.com/blevesearch/bleve/v2/search/query"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/utils"
)

type Search struct {
	communityCase *Community

	// cache is map string -> *usersIndex | *communitiesIndex
	indexesCache  sync.Map
	cacheLifetime time.Duration
	cleanupPeriod time.Duration
}

type membersIndex struct {
	createdAt time.Time
	index     bleve.Index
	members   map[string]*domain.Member
}

type communitiesIndex struct {
	createdAt   time.Time
	index       bleve.Index
	communities map[string]*domain.Community
}

func NewSearch(communityCase *Community) *Search {
	s := &Search{
		communityCase: communityCase,
		cacheLifetime: 30 * time.Second,
		cleanupPeriod: 5 * time.Minute,
	}
	go s.cacheCleaner()
	return s
}

func (s *Search) SearchMembers(ctx Context, communityID, text string) ([]*domain.Member, error) {
	if err := s.communityCase.ensureUserIsMember(ctx, communityID); err != nil {
		return nil, fmt.Errorf("failed to ensure user is member: %w", err)
	}

	index, err := s.getMembersIndex(ctx, communityID)
	if err != nil {
		return nil, fmt.Errorf("failed to get members index: %w", err)
	}

	req := s.buildSearchRequest(text)
	users, err := index.Search(req)
	if err != nil {
		return nil, fmt.Errorf("failed to search index: %w", err)
	}
	return users, nil
}

func (s *Search) SearchCommunities(ctx Context, text string) ([]*domain.Community, error) {
	index, err := s.getCommunitiesIndex(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get community index: %w", err)
	}

	req := s.buildSearchRequest(text)
	communities, err := index.Search(req)
	if err != nil {
		return nil, fmt.Errorf("failed to search index: %w", err)
	}
	return communities, nil
}

func (i *membersIndex) Search(req *bleve.SearchRequest) ([]*domain.Member, error) {
	res, err := i.index.Search(req)
	if err != nil {
		return nil, fmt.Errorf("failed to search index: %w", err)
	}

	var users []*domain.Member
	for _, hit := range res.Hits {
		users = append(users, i.members[hit.ID])
	}
	return users, nil
}

func (i *communitiesIndex) Search(req *bleve.SearchRequest) ([]*domain.Community, error) {
	res, err := i.index.Search(req)
	if err != nil {
		return nil, fmt.Errorf("failed to search index: %w", err)
	}

	var communities []*domain.Community
	for _, hit := range res.Hits {
		communities = append(communities, i.communities[hit.ID])
	}
	return communities, nil
}

func (s *Search) buildSearchRequest(text string) *bleve.SearchRequest {
	text = strings.ToLower(text)

	tText := utils.Transliterate(text)
	sText := utils.SwapKeyboardLayout(text)
	stText := utils.Transliterate(sText)

	texts := []string{text, tText, sText, stText}
	boosts := []float64{1, 0.5, 0.5, 0.25}

	var qs []query.Query
	for i := range texts {
		q := bleve.NewMatchQuery(texts[i])
		q.Analyzer = ru.AnalyzerName
		q.BoostVal = (*query.Boost)(&boosts[i])
		qs = append(qs, q)
	}
	for i := range texts {
		q := bleve.NewPrefixQuery(texts[i])
		q.BoostVal = (*query.Boost)(&boosts[i])
		qs = append(qs, q)
	}
	for i := range texts {
		q := bleve.NewFuzzyQuery(texts[i])
		q.Fuzziness = 2
		q.BoostVal = (*query.Boost)(&boosts[i])
		qs = append(qs, q)
	}

	query := bleve.NewDisjunctionQuery(qs...)
	return bleve.NewSearchRequest(query)
}

func (s *Search) usersIndexFromCache(communityID string) (*membersIndex, bool) {
	i, ok := s.indexesCache.Load(communityID)
	if !ok {
		return nil, false
	}
	index, _ := i.(*membersIndex)
	if time.Since(index.createdAt) > s.cacheLifetime {
		s.indexesCache.Delete(communityID)
		return nil, false
	}

	return index, true
}

func (s *Search) communitiesIndexFromCache(communityID string) (*communitiesIndex, bool) {
	i, ok := s.indexesCache.Load(communityID)
	if !ok {
		return nil, false
	}
	index, _ := i.(*communitiesIndex)
	if time.Since(index.createdAt) > s.cacheLifetime {
		s.indexesCache.Delete(communityID)
		return nil, false
	}

	return index, true
}

func (s *Search) getMembersIndex(ctx Context, communityID string) (*membersIndex, error) {
	index, ok := s.usersIndexFromCache(communityID)
	if ok {
		return index, nil
	}

	community, err := s.communityCase.GetByID(ctx, communityID)
	if err != nil {
		return nil, fmt.Errorf("failed to get community: %w", err)
	}
	newIndex, err := s.buildMembersIndex(community.Members)
	if err != nil {
		return nil, fmt.Errorf("failed to build index: %w", err)
	}
	s.indexesCache.Store(communityID, newIndex)

	return newIndex, nil
}

func (s *Search) getCommunitiesIndex(ctx Context) (*communitiesIndex, error) {
	index, ok := s.communitiesIndexFromCache("communities")
	if ok {
		return index, nil
	}

	communities, err := s.communityCase.GetPreviews(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get communities: %w", err)
	}
	newIndex, err := s.buildCommunitiesIndex(communities)
	if err != nil {
		return nil, fmt.Errorf("failed to build index: %w", err)
	}
	s.indexesCache.Store("communities", newIndex)

	return newIndex, nil
}

type searchMember struct {
	Data string `json:"data"`
}

func memberToSearchMember(member *domain.Member) *searchMember {
	data := member.User.FirstName + " " + member.User.LastName + " " + member.User.TelegramUsername
	for _, field := range member.Config.Fields {
		switch field.Type {
		case domain.FieldTypeTextarea:
			data += " " + field.Textarea.Value
		case domain.FieldTypeTextinput:
			data += " " + field.Textinput.Value
		}
	}
	return &searchMember{
		Data: data,
	}
}

func (s *Search) buildMembersIndex(members []*domain.Member) (*membersIndex, error) {
	russianTextAnalyzer := bleve.NewTextFieldMapping()
	russianTextAnalyzer.Analyzer = ru.AnalyzerName

	mapping := bleve.NewIndexMapping()
	memberMapping := bleve.NewDocumentMapping()
	memberMapping.AddFieldMappingsAt("data", russianTextAnalyzer)
	mapping.AddDocumentMapping("member", memberMapping)
	mapping.DefaultType = "member"

	index, err := bleve.NewMemOnly(mapping)
	if err != nil {
		panic(err)
	}
	for _, member := range members {
		err := index.Index(member.User.ID, memberToSearchMember(member))
		if err != nil {
			return nil, fmt.Errorf("failed to index user: %w", err)
		}
	}

	membersMap := make(map[string]*domain.Member)
	for _, member := range members {
		membersMap[member.User.ID] = member
	}

	return &membersIndex{
		createdAt: time.Now(),
		index:     index,
		members:   membersMap,
	}, nil
}

func (s *Search) buildCommunitiesIndex(communities []*domain.Community) (*communitiesIndex, error) {
	communityMapping := bleve.NewDocumentMapping()
	communityNameMapping := bleve.NewTextFieldMapping()
	communityNameMapping.Analyzer = ru.AnalyzerName
	communityMapping.AddFieldMappingsAt("name", communityNameMapping)
	noneMapping := bleve.NewTextFieldMapping()
	noneMapping.Store = false
	communityMapping.AddFieldMappingsAt("id", noneMapping)
	communityMapping.AddFieldMappingsAt("avatar", noneMapping)

	mapping := bleve.NewIndexMapping()
	mapping.AddDocumentMapping("community", communityMapping)
	index, err := bleve.NewMemOnly(mapping)
	if err != nil {
		panic(err)
	}
	for _, community := range communities {
		err := index.Index(community.ID, community)
		if err != nil {
			return nil, fmt.Errorf("failed to index community: %w", err)
		}
	}

	communitiesMap := make(map[string]*domain.Community)
	for _, community := range communities {
		communitiesMap[community.ID] = community
	}

	return &communitiesIndex{
		createdAt:   time.Now(),
		index:       index,
		communities: communitiesMap,
	}, nil
}

func (s *Search) cacheCleaner() {
	for {
		time.Sleep(s.cacheLifetime)
		s.indexesCache.Range(func(key, value interface{}) bool {
			switch v := value.(type) {
			case *membersIndex:
				if time.Since(v.createdAt) > s.cacheLifetime {
					s.indexesCache.Delete(key)
				}
			case *communitiesIndex:
				if time.Since(v.createdAt) > s.cacheLifetime {
					s.indexesCache.Delete(key)
				}
			}
			return true
		})
	}
}
