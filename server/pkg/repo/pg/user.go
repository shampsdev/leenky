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

type UserRepo struct {
	db   *pgxpool.Pool
	psql sq.StatementBuilderType
}

func NewUserRepo(db *pgxpool.Pool) *UserRepo {
	return &UserRepo{
		db:   db,
		psql: sq.StatementBuilder.PlaceholderFormat(sq.Dollar),
	}
}

func (r *UserRepo) Create(ctx context.Context, user *domain.CreateUser) (string, error) {
	var id string
	err := r.db.QueryRow(
		ctx,
		`INSERT INTO "user" (id, telegram_id, telegram_username, first_name, last_name, avatar)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		user.TelegramID,
		user.TelegramUsername,
		user.FirstName,
		user.LastName,
		user.Avatar,
	).Scan(&id)
	return id, err
}

func (r *UserRepo) Patch(ctx context.Context, user *domain.PatchUser) error {
	s := r.psql.Update(`"user"`).
		Where(sq.Eq{"id": user.ID})

	if user.FirstName != nil {
		s = s.Set("first_name", *user.FirstName)
	}

	if user.LastName != nil {
		s = s.Set("last_name", *user.LastName)
	}
	if user.TelegramUsername != nil {
		s = s.Set("telegram_username", *user.TelegramUsername)
	}
	if user.Avatar != nil {
		s = s.Set("avatar", *user.Avatar)
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

func (r *UserRepo) Delete(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM "user" WHERE id = $1`, id)
	return err
}

func (r *UserRepo) Filter(ctx context.Context, filter *domain.FilterUser) ([]*domain.User, error) {
	s := r.psql.Select("id", "telegram_id", "telegram_username", "first_name", "last_name", "avatar").
		From(`"user"`)

	if filter.ID != nil {
		s = s.Where(sq.Eq{"id": *filter.ID})
	}

	if filter.TelegramID != nil {
		s = s.Where(sq.Eq{"telegram_id": *filter.TelegramID})
	}

	sql, args, err := s.ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build SQL: %w", err)
	}

	rows, err := r.db.Query(ctx, sql, args...)
	if errors.Is(err, pgx.ErrNoRows) {
		return []*domain.User{}, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to execute SQL: %w", err)
	}
	defer rows.Close()

	var users []*domain.User
	for rows.Next() {
		var user domain.User
		err := rows.Scan(
			&user.ID,
			&user.TelegramID,
			&user.TelegramUsername,
			&user.FirstName,
			&user.LastName,
			&user.Avatar,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		users = append(users, &user)
	}

	return users, nil
}
