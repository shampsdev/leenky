package pg

import (
	"context"
	"errors"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/tglinked/server/pkg/domain"
)

type MemberRepo struct {
	db   *pgxpool.Pool
	psql sq.StatementBuilderType
}

func NewMemberRepo(db *pgxpool.Pool) *MemberRepo {
	return &MemberRepo{
		db:   db,
		psql: sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
	}
}

func (r *MemberRepo) Create(ctx context.Context, member *domain.CreateMember) error {
	_, err := r.db.Exec(
		ctx,
		"INSERT INTO member (user_id, community_id, is_admin, config) VALUES ($1, $2, $3, $4)",
		member.UserID,
		member.CommunityID,
		member.IsAdmin,
		member.Config,
	)
	return err
}

func (r *MemberRepo) Patch(ctx context.Context, member *domain.PatchMember) error {
	s := r.psql.Update("member").
		Where(sq.Eq{"user_id": member.UserID, "community_id": member.CommunityID})

	if member.IsAdmin != nil {
		s = s.Set("is_admin", *member.IsAdmin)
	}

	if member.Config != nil {
		s = s.Set("config", *member.Config)
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

func (r *MemberRepo) Delete(ctx context.Context, userID, communityID string) error {
	_, err := r.db.Exec(ctx, "DELETE FROM member WHERE user_id = $1 AND community_id = $2", userID, communityID)
	return err
}

func (r *MemberRepo) Filter(ctx context.Context, filter *domain.FilterMember) ([]*domain.Member, error) {
	s := r.psql.Select("user_id", "community_id", "is_admin", "member.config").
		From("member")

	if filter.CommunityID != nil {
		s = s.Where(sq.Eq{"community_id": *filter.CommunityID})
	}

	if filter.UserID != nil {
		s = s.Where(sq.Eq{"user_id": *filter.UserID})
	}

	if filter.IsAdmin != nil {
		s = s.Where(sq.Eq{"is_admin": *filter.IsAdmin})
	}

	if filter.IncludeCommunity {
		s = s.Columns("community.name", "community.description", "community.avatar", "community.config")
		s = s.Join("community ON member.community_id = community.id")
	}

	if filter.IncludeUser {
		s = s.Columns(`"user".telegram_id`, `"user".telegram_username`, `"user".first_name`, `"user".last_name`, `"user".avatar`)
		s = s.Join(`"user" ON member.user_id = "user".id`)
	}

	sql, args, err := s.ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build SQL: %w", err)
	}

	rows, err := r.db.Query(ctx, sql, args...)
	if errors.Is(err, pgx.ErrNoRows) {
		return []*domain.Member{}, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to execute SQL: %w", err)
	}
	defer rows.Close()

	var members []*domain.Member
	for rows.Next() {
		var member domain.Member
		member.Config = &domain.MemberConfig{}
		member.User = &domain.User{}
		member.Community = &domain.Community{}
		dest := []any{
			&member.User.ID,
			&member.Community.ID,
			&member.IsAdmin,
			member.Config,
		}

		if filter.IncludeCommunity {
			dest = append(
				dest,
				&member.Community.Name,
				&member.Community.Description,
				&member.Community.Avatar,
				&member.Community.Config,
			)
		}

		if filter.IncludeUser {
			dest = append(
				dest,
				&member.User.TelegramID,
				&member.User.TelegramUsername,
				&member.User.FirstName,
				&member.User.LastName,
				&member.User.Avatar,
			)
		}

		err := rows.Scan(dest...)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		members = append(members, &member)
	}

	return members, nil
}
