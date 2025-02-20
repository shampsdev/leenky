package pg

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/tglinked/server/pkg/domain"
)

type UserRepo struct {
	db *pgxpool.Pool
}

func NewUserRepo(db *pgxpool.Pool) *UserRepo {
	return &UserRepo{db: db}
}

func (r *UserRepo) CreateUser(ctx context.Context, user *domain.User) (string, error) {
	var newID string
	err := r.db.QueryRow(ctx, `
        INSERT INTO "user" ("telegram_id", "telegram_username", "avatar", "first_name", "last_name", "company", "role", "bio") 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING "id"`,
		user.TelegramID, user.TelegramUsername, user.Avatar, user.FirstName, user.LastName, user.Company, user.Role, user.Bio,
	).Scan(&newID)
	if err != nil {
		return "", fmt.Errorf("failed to create user: %w", err)
	}
	return newID, nil
}

func (r *UserRepo) UpdateUser(ctx context.Context, id string, user *domain.EditUser) (*domain.User, error) {
	newUser := &domain.User{}
	err := r.db.QueryRow(ctx, `
		UPDATE "user" 
		SET "first_name" = $1, "last_name" = $2, "company" = $3, "role" = $4, "bio" = $5
		WHERE "id" = $6 
		RETURNING "id", "telegram_id", "telegram_username", "avatar", "first_name", "last_name", "company", "role", "bio"`,
		user.FirstName, user.LastName, user.Company, user.Role, user.Bio, id,
	).Scan(
		&newUser.ID,
		&newUser.TelegramID,
		&newUser.TelegramUsername,
		&newUser.Avatar,
		&newUser.FirstName,
		&newUser.LastName,
		&newUser.Company,
		&newUser.Role,
		&newUser.Bio,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}
	return newUser, nil
}

func (r *UserRepo) GetUserByID(ctx context.Context, id string) (*domain.User, error) {
	row := r.db.QueryRow(ctx, `
		SELECT "id", "telegram_id", "telegram_username", "avatar", "first_name", "last_name", "company", "role", "bio"
		FROM "user" 
		WHERE "id" = $1`,
		id,
	)
	user := &domain.User{}
	if err := row.Scan(
		&user.ID,
		&user.TelegramID,
		&user.TelegramUsername,
		&user.Avatar,
		&user.FirstName,
		&user.LastName,
		&user.Company,
		&user.Role,
		&user.Bio,
	); err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	return user, nil
}

func (r *UserRepo) GetUserByTelegramID(ctx context.Context, telegramID int64) (*domain.User, error) {
	row := r.db.QueryRow(ctx, `
		SELECT "id", "telegram_id", "telegram_username", "avatar", "first_name", "last_name", "company", "role", "bio" 
		FROM "user" 
		WHERE "telegram_id" = $1`,
		telegramID,
	)
	user := &domain.User{}
	if err := row.Scan(
		&user.ID,
		&user.TelegramID,
		&user.TelegramUsername,
		&user.Avatar,
		&user.FirstName,
		&user.LastName,
		&user.Company,
		&user.Role,
		&user.Bio,
	); err != nil {
		return nil, fmt.Errorf("failed to get user by telegram ID: %w", err)
	}
	return user, nil
}
