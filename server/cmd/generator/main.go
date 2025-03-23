package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"image"
	"image/jpeg"
	"io"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/nfnt/resize"
	"github.com/shampsdev/tglinked/server/cmd/config"
	"github.com/shampsdev/tglinked/server/pkg/repo/s3"
	"github.com/shampsdev/tglinked/server/pkg/utils/slogx"
)

// Это просто генератор картинок котиков для пользователей
func main() {
	log := config.Logger()
	slog.SetDefault(log)
	log.Info("Hello from tglinked generator!")

	cfg := config.Load(".env")
	cfg.Print()
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	pgConfig := cfg.PGXConfig()
	pool, err := pgxpool.NewWithConfig(ctx, pgConfig)
	if err != nil {
		slogx.Fatal(log, "can't create new database pool")
	}
	defer pool.Close()

	cfg.S3.RootDirectory = "leenky/cats"
	storage, err := s3.NewStorage(cfg.S3)
	if err != nil {
		slogx.Fatal(log, "can't create new storage")
	}

	err = updateAvatars(ctx, pool, storage)
	if err != nil {
		slogx.Fatal(log, "can't update avatars: %v", err)
	}
}

type CatImageResponse struct {
	URL string `json:"url"`
}

type ImageStorage interface {
	SaveImageByBytes(ctx context.Context, image []byte, key string) (string, error)
}

func updateAvatars(ctx context.Context, pool *pgxpool.Pool, storage ImageStorage) error {
	rows, err := pool.Query(ctx, `SELECT id FROM "chat" WHERE LENGTH(id) < 10`)
	if err != nil {
		return fmt.Errorf("query failed: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		if ctx.Err() != nil {
			return ctx.Err()
		}
		time.Sleep(500 * time.Millisecond)
		var userID string
		if err := rows.Scan(&userID); err != nil {
			return fmt.Errorf("row scan failed: %w", err)
		}

		catImageURL, err := getRandomCatImageURL(ctx, storage)
		if err != nil {
			slogx.FromCtxWithErr(ctx, err).Error("failed to get random cat image")
			continue
		}

		_, err = pool.Exec(ctx, `UPDATE "chat" SET avatar=$1 WHERE id=$2`, catImageURL, userID)
		if err != nil {
			slogx.FromCtxWithErr(ctx, err).Error("failed to update user avatar")
			continue
		}
	}

	return nil
}

func getRandomCatImageURL(ctx context.Context, storage ImageStorage) (string, error) {
	resp, err := http.Get("https://api.thecatapi.com/v1/images/search?size=min&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1")
	if err != nil {
		return "", fmt.Errorf("failed to fetch random cat image: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response body: %w", err)
	}

	var catImages []CatImageResponse
	err = json.Unmarshal(body, &catImages)
	if err != nil {
		return "", fmt.Errorf("failed to unmarshal JSON: %w", err)
	}

	if len(catImages) == 0 {
		return "", fmt.Errorf("no images found")
	}

	// Загружаем изображение
	resp, err = http.Get(catImages[0].URL)
	if err != nil {
		return "", fmt.Errorf("failed to download image: %w", err)
	}
	defer resp.Body.Close()

	img, _, err := image.Decode(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to decode image: %w", err)
	}

	// Масштабируем изображение до 300x300 пикселей
	img = resize.Thumbnail(300, 300, img, resize.Lanczos3)

	// Сохраняем изображение в буфер
	var buf bytes.Buffer
	err = jpeg.Encode(&buf, img, nil)
	if err != nil {
		return "", fmt.Errorf("failed to encode image: %w", err)
	}

	url, err := storage.SaveImageByBytes(ctx, buf.Bytes(), "")
	if err != nil {
		return "", fmt.Errorf("failed to save image: %w", err)
	}

	return url, nil
}
