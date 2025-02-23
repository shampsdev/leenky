package pg

import (
	"context"
	"errors"
	"fmt"
	"math/rand/v2"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/repo"
)

type ChatRepo struct {
	db   *pgxpool.Pool
	rand *rand.Rand
}

func NewChatRepo(db *pgxpool.Pool) *ChatRepo {
	return &ChatRepo{
		rand: rand.New(rand.NewPCG(uint64(time.Now().UnixNano()), rand.Uint64())),
		db:   db,
	}
}

func (r *ChatRepo) CreateChat(ctx context.Context, chat *domain.Chat) (string, error) {
	var id string
	err := r.db.QueryRow(ctx, `
		INSERT INTO "chat" ("id", "name", "avatar", "telegram_id") 
		VALUES ($1, $2, $3, $4) RETURNING "id"`,
		r.generateID(), chat.Name, chat.Avatar, chat.TelegramID,
	).Scan(&id)
	if err != nil {
		return "", fmt.Errorf("failed to create chat: %w", err)
	}
	return id, nil
}

var letterRunes = []rune("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ")

func (r *ChatRepo) generateID() string {
	b := make([]rune, 10)
	for i := range b {
		b[i] = letterRunes[r.rand.IntN(len(letterRunes))]
	}
	return string(b)
}

func (r *ChatRepo) UpdateChat(ctx context.Context, chat *domain.Chat) (*domain.Chat, error) {
	_, err := r.db.Exec(ctx, `
		UPDATE "chat" SET "name" = $1, "avatar" = $2, "telegram_id" = $3, "updated_at" = NOW(), WHERE "id" = $4`,
		chat.Name, chat.Avatar, chat.TelegramID, chat.ID,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update chat: %w", err)
	}
	return chat, nil
}

func (r *ChatRepo) DeleteChat(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM "chat" WHERE "id" = $1`, id)
	if err != nil {
		return fmt.Errorf("failed to delete chat: %w", err)
	}
	return nil
}

func (r *ChatRepo) IsChatExists(ctx context.Context, id string) (bool, error) {
	var exists bool
	err := r.db.QueryRow(ctx, `SELECT EXISTS (SELECT 1 FROM "chat" WHERE "id" = $1)`, id).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("failed to check if chat exists: %w", err)
	}
	return exists, nil
}

func (r *ChatRepo) GetChatByID(ctx context.Context, id string) (*domain.Chat, error) {
	row := r.db.QueryRow(ctx, `SELECT "id", "name", "avatar", "telegram_id" FROM "chat" WHERE "id" = $1`, id)
	chat := &domain.Chat{}
	if err := row.Scan(&chat.ID, &chat.Name, &chat.Avatar, &chat.TelegramID); err != nil {
		return nil, fmt.Errorf("failed to get chat by ID: %w", err)
	}
	return chat, nil
}

func (r *ChatRepo) GetChatPreviewByID(ctx context.Context, id string) (*domain.ChatPreview, error) {
	row := r.db.QueryRow(ctx, `
		SELECT c."id", c."name", c."avatar", c."telegram_id", COUNT(cu."user_id")
		FROM "chat" c
		LEFT JOIN "chat_user" cu ON c."id" = cu."chat_id"
		WHERE c."id" = $1
		GROUP BY c."id"`,
		id,
	)
	chat := &domain.ChatPreview{}
	err := row.Scan(&chat.ID, &chat.Name, &chat.Avatar, &chat.TelegramID, &chat.UsersAmount)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, repo.ErrChatNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get chat preview by ID: %w", err)
	}
	return chat, nil
}

func (r *ChatRepo) GetChatByTelegramID(ctx context.Context, telegramID int64) (*domain.Chat, error) {
	row := r.db.QueryRow(ctx, `SELECT "id", "name", "avatar", "telegram_id" FROM "chat" WHERE "telegram_id" = $1`, telegramID)
	chat := &domain.Chat{}
	err := row.Scan(&chat.ID, &chat.Name, &chat.Avatar, &chat.TelegramID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, repo.ErrChatNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get chat by telegram ID: %w", err)
	}
	return chat, nil
}

func (r *ChatRepo) GetChatPreviewsWithUser(ctx context.Context, userID string) ([]*domain.ChatPreview, error) {
	rows, err := r.db.Query(ctx, `
		SELECT c."id", c."name", c."avatar", c."telegram_id", COUNT(cu2."user_id") as "users_count"
		FROM "chat" c
		JOIN "chat_user" cu ON c."id" = cu."chat_id"
		LEFT JOIN "chat_user" cu2 ON cu2."chat_id" = c."id"
		WHERE cu."user_id" = $1
		GROUP BY c."id"
	`,
		userID,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get chats with user: %w", err)
	}
	defer rows.Close()

	var chats []*domain.ChatPreview
	for rows.Next() {
		chat := &domain.ChatPreview{}
		if err := rows.Scan(&chat.ID, &chat.Name, &chat.Avatar, &chat.TelegramID, &chat.UsersAmount); err != nil {
			return nil, fmt.Errorf("failed to scan chat row: %w", err)
		}
		chats = append(chats, chat)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error occurred during scanning: %w", err)
	}
	return chats, nil
}

func (r *ChatRepo) SetChatUsers(ctx context.Context, chatID string, userIDs []string) error {
	if len(userIDs) == 0 {
		return nil
	}
	batch := &pgx.Batch{}

	query := `
		INSERT INTO "chat_user" ("chat_id", "user_id") 
        VALUES ($1, $2)
        ON CONFLICT ("chat_id", "user_id") DO NOTHING`

	for _, userID := range userIDs {
		batch.Queue(query, chatID, userID)
	}

	br := r.db.SendBatch(ctx, batch)
	defer br.Close()

	_, err := br.Exec()
	if err != nil {
		return fmt.Errorf("could not attach tags to place: %w", err)
	}
	return nil
}

func (r *ChatRepo) AttachUserToChat(ctx context.Context, chatID, userID string) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO "chat_user" ("chat_id", "user_id") 
		VALUES ($1, $2)`,
		chatID, userID,
	)
	return err
}

func (r *ChatRepo) DetachUserFromChat(ctx context.Context, chatID, userID string) error {
	_, err := r.db.Exec(ctx, `
		DELETE FROM "chat_user" WHERE "chat_id" = $1 AND "user_id" = $2`,
		chatID, userID,
	)
	return err
}

func (r *ChatRepo) GetChatUsers(ctx context.Context, chatID string) ([]*domain.User, error) {
	rows, err := r.db.Query(ctx, `
		SELECT "id", "telegram_id", "telegram_username", "avatar", "first_name", "last_name", "company", "role", "bio"
		FROM "user" u
		JOIN "chat_user" cu ON u."id" = cu."user_id"
		WHERE cu."chat_id" = $1`,
		chatID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*domain.User
	for rows.Next() {
		user := &domain.User{}
		if err := rows.Scan(
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
			return nil, err
		}
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}
	return users, nil
}

func (r *ChatRepo) IsUserInChat(ctx context.Context, userID, chatID string) (bool, error) {
	var exists bool
	err := r.db.QueryRow(ctx, `
		SELECT EXISTS (
			SELECT 1 FROM "chat_user" WHERE "user_id" = $1 AND "chat_id" = $2
		)`,
		userID, chatID,
	).Scan(&exists)
	return exists, err
}

func (r *ChatRepo) AreUsersShareSameChat(ctx context.Context, userIDs []string) (bool, error) {
	userIDs = dedup(userIDs)
	if len(userIDs) == 0 {
		return false, nil
	}

	query := `
    SELECT COUNT(DISTINCT cu.user_id)
    FROM chat_user cu
    WHERE cu.chat_id IN (
        SELECT cu2.chat_id
        FROM chat_user cu2
        WHERE cu2.user_id = ANY($1)
        GROUP BY cu2.chat_id
        HAVING COUNT(DISTINCT cu2.user_id) = $2
    )`

	var count int
	err := r.db.QueryRow(ctx, query, userIDs, len(userIDs)).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("error checking shared chats: %w", err)
	}

	return count >= 1, nil
}

func dedup[T comparable](slice []T) []T {
	seen := make(map[T]struct{})
	var result []T
	for _, v := range slice {
		if _, ok := seen[v]; ok {
			continue
		}
		seen[v] = struct{}{}
		result = append(result, v)
	}
	return result
}
