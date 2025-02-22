package localstorage

import (
	"context"
	"fmt"
	"io"
	"math/rand"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/shampsdev/tglinked/server/pkg/repo"
)

var _ repo.ImageStorage = &Storage{}

type Storage struct {
	serverUrl string
	imagesDir string
	rand      *rand.Rand
}

func NewStorage(serverUrl, imagesDir string) *Storage {
	return &Storage{
		serverUrl: serverUrl,
		imagesDir: imagesDir,
		rand:      rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

func (s *Storage) SavePhoto(_ context.Context, url string) (string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", fmt.Errorf("failed to download image: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("failed to download image, status: %s", resp.Status)
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read image: %w", err)
	}
	mimeType := resp.Header.Get("Content-Type")

	fileName := s.genRandomName()
	filePath := filepath.Join(s.imagesDir, fileName+mime.TypeByExtension(mimeType))

	file, err := os.Create(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to create image file: %w", err)
	}
	defer file.Close()

	_, err = file.Write(data)
	if err != nil {
		return "", fmt.Errorf("failed to save image to file: %w", err)
	}

	imageUrl := fmt.Sprintf("%s/%s", s.serverUrl, filePath)
	return imageUrl, nil
}

func (s *Storage) genRandomName() string {
	return s.generateID() + ".jpg"
}

var letterRunes = []rune("0123456789abcdefghijklmnopqrstuvwxyz")

func (s *Storage) generateID() string {
	b := make([]rune, 15)
	for i := range b {
		b[i] = letterRunes[s.rand.Intn(len(letterRunes))]
	}
	return string(b)
}
