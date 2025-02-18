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
        INSERT INTO "user" ("telegram_id", "first_name", "last_name", "company", "role", "bio") 
        VALUES ($1, $2, $3, $4, $5) RETURNING "id"`,
		user.TelegramID, user.FirstName, user.LastName, user.Company, user.Role, user.Bio,
	).Scan(&newID)
	if err != nil {
		return "", fmt.Errorf("failed to create user: %w", err)
	}
	return newID, nil
}

func (r *UserRepo) UpdateUser(ctx context.Context, user *domain.User) (*domain.User, error) {
	_, err := r.db.Exec(ctx, `
		UPDATE "user" 
		SET "first_name" = $1, "last_name" = $2, "company" = $3, "role" = $4, "bio" = $5
		WHERE "id" = $6`,
		user.FirstName, user.LastName, user.Company, user.Role, user.Bio, user.ID,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}
	return user, nil
}

func (r *UserRepo) GetUserByID(ctx context.Context, id string) (*domain.User, error) {
	row := r.db.QueryRow(ctx, `
		SELECT "id", "telegram_id", "first_name", "last_name", "company", "role", "bio"
		FROM "user" 
		WHERE "id" = $1`,
		id,
	)
	user := &domain.User{}
	if err := row.Scan(&user.ID, &user.TelegramID, &user.FirstName, &user.LastName, &user.Company, &user.Role, &user.Bio); err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	return user, nil
}

func (r *UserRepo) GetUserByTelegramID(ctx context.Context, telegramID int64) (*domain.User, error) {
	row := r.db.QueryRow(ctx, `
		SELECT "id", "telegram_id", "first_name", "last_name", "company", "role", "bio" 
		FROM "user" 
		WHERE "telegram_id" = $1`,
		telegramID,
	)
	user := &domain.User{}
	if err := row.Scan(&user.ID, &user.TelegramID, &user.FirstName, &user.LastName, &user.Company, &user.Role, &user.Bio); err != nil {
		return nil, fmt.Errorf("failed to get user by telegram ID: %w", err)
	}
	return user, nil
}
