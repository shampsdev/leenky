package pg

import (
	"context"
	"errors"
	"fmt"
	"math/rand/v2"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/tglinked/server/pkg/domain"
)

var letterRunes = []rune("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ")

type CommunityRepo struct {
	db   *pgxpool.Pool
	rand *rand.Rand
	psql sq.StatementBuilderType
}

func NewCommunityRepo(db *pgxpool.Pool) *CommunityRepo {
	return &CommunityRepo{
		db:   db,
		rand: rand.New(rand.NewPCG(uint64(time.Now().UnixNano()), rand.Uint64())),
		psql: sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
	}
}

func (r *CommunityRepo) Create(ctx context.Context, community *domain.CreateCommunity) (string, error) {
	id := r.generateID()
	_, err := r.db.Exec(
		ctx,
		"INSERT INTO community (id, name, description, avatar, config) VALUES ($1, $2, $3, $4, $5)",
		id,
		community.Name,
		community.Description,
	)
	return id, err
}

func (r *CommunityRepo) generateID() string {
	b := make([]rune, 10)
	for i := range b {
		b[i] = letterRunes[r.rand.IntN(len(letterRunes))]
	}
	return string(b)
}

func (r *CommunityRepo) Patch(ctx context.Context, community *domain.PatchCommunity) error {
	s := r.psql.Update("community").
		Where(sq.Eq{"id": community.ID})

	if community.Name != nil {
		s = s.Set("name", *community.Name)
	}

	if community.Description != nil {
		s = s.Set("description", *community.Description)
	}

	if community.Avatar != nil {
		s = s.Set("avatar", *community.Avatar)
	}

	if community.Config != nil {
		s = s.Set("config", *community.Config)
	}

	if community.TGChatID != nil {
		s = s.Set("tg_chat_id", *community.TGChatID)
	}

	sql, args, err := s.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build SQL: %w", err)
	}

	_, err = r.db.Exec(ctx, sql, args...)
	if err != nil {
		return fmt.Errorf("failed to execute SQL: %w", err)
	}

	return nil
}

func (r *CommunityRepo) Delete(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, "DELETE FROM community WHERE id = $1", id)
	return err
}

func (r *CommunityRepo) Filter(ctx context.Context, filter *domain.FilterCommunity) ([]*domain.Community, error) {
	s := r.psql.Select("id", "name", "description", "avatar", "community.config", "community.tg_chat_id").
		From("community")

	if filter.ID != nil {
		s = s.Where(sq.Eq{"id": *filter.ID})
	}

	if filter.TGChatID != nil {
		s = s.Where(sq.Eq{"tg_chat_id": *filter.TGChatID})
	}

	if filter.Members != nil {
		s = s.Join("member m1 ON m1.community_id = community.id").
			Where(sq.Eq{"m1.user_id": filter.Members})
	}

	if filter.IncludeMembersCount {
		s = s.LeftJoin("member m2 ON m2.community_id = community.id").
			GroupBy("community.id").
			Columns("COUNT(m2.user_id) as members_count")
	}

	sql, args, err := s.ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build SQL: %w", err)
	}

	rows, err := r.db.Query(ctx, sql, args...)
	if errors.Is(err, pgx.ErrNoRows) {
		return []*domain.Community{}, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to execute SQL: %w", err)
	}
	defer rows.Close()

	var communities []*domain.Community
	for rows.Next() {
		var community domain.Community
		dest := []any{
			&community.ID,
			&community.Name,
			&community.Description,
			&community.Avatar,
			&community.Config,
			&community.TGChatID,
		}
		if filter.IncludeMembersCount {
			dest = append(dest, &community.MembersCount)
		}
		err := rows.Scan(dest...)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		communities = append(communities, &community)
	}

	return communities, nil
}
