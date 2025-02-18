package pg

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/tglinked/server/pkg/domain"
)

type ChatRepo struct {
	db *pgxpool.Pool
}

func NewChatRepo(db *pgxpool.Pool) *ChatRepo {
	return &ChatRepo{db: db}
}

func (r *ChatRepo) CreateChat(ctx context.Context, chat *domain.Chat) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO "chat" ("name", "avatar") 
		VALUES ($1, $2) RETURNING "id"`,
		chat.Name, chat.Avatar,
	)
	return err
}

func (r *ChatRepo) GetChatByID(ctx context.Context, id string) (*domain.Chat, error) {
	row := r.db.QueryRow(ctx, `SELECT "id", "name", "avatar" FROM "chat" WHERE "id" = $1`, id)
	chat := &domain.Chat{}
	if err := row.Scan(&chat.ID, &chat.Name, &chat.Avatar); err != nil {
		return nil, err
	}
	return chat, nil
}

func (r *ChatRepo) GetChatsWithUser(ctx context.Context, userID string) ([]*domain.Chat, error) {
	rows, err := r.db.Query(ctx, `
		SELECT c."id", c."name", c."avatar" 
		FROM "chat" c
		JOIN "chat_user" cu ON c."id" = cu."chat_id"
		WHERE cu."user_id" = $1`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var chats []*domain.Chat
	for rows.Next() {
		chat := &domain.Chat{}
		if err := rows.Scan(&chat.ID, &chat.Name, &chat.Avatar); err != nil {
			return nil, err
		}
		chats = append(chats, chat)
	}

	if err = rows.Err(); err != nil {
		return nil, err
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

func (r *ChatRepo) GetChatUsers(ctx context.Context, chatID string) ([]*domain.User, error) {
	rows, err := r.db.Query(ctx, `
		SELECT "id", "first_name", "last_name", "company", "role", "bio"
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
		if err := rows.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Company, &user.Role, &user.Bio); err != nil {
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
