package tg

import (
	"context"
	"fmt"
	"log"

	"github.com/go-telegram/bot"
	"github.com/go-telegram/bot/models"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/tglinked/server/cmd/config"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

func NewBot(ctx context.Context, cfg *config.Config, pool *pgxpool.Pool) (*bot.Bot, error) {
	opts := []bot.Option{}

	if cfg.Debug {
		opts = append(opts, bot.WithDebug())
	}

	b, err := bot.New(cfg.TG.BotToken, opts...)
	if err != nil {
		return nil, err
	}
	cases := usecase.Setup(pool, b)

	_, err = b.SetMyCommands(ctx, &bot.SetMyCommandsParams{
		Commands: []models.BotCommand{
			{
				Command:     "test",
				Description: "Test command",
			},
			{
				Command:     "register",
				Description: "Register chat",
			},
		},
	})
	if err != nil {
		return nil, err
	}

	b.RegisterHandlerMatchFunc(func(update *models.Update) bool {
		return update.MyChatMember != nil
	}, handleMyChatMember(cases.Chat))

	b.RegisterHandler(bot.HandlerTypeMessageText, "/test", bot.MatchTypePrefix, handleCommandTest)
	b.RegisterHandler(bot.HandlerTypeMessageText, "/register", bot.MatchTypePrefix, handleCommandRegister(cases.Chat))

	return b, nil
}

func handleMyChatMember(chatCase *usecase.Chat) bot.HandlerFunc {
	return func(ctx context.Context, b *bot.Bot, update *models.Update) {
		mcm := update.MyChatMember
		registerChat(ctx, b, chatCase, mcm.Chat.ID)
	}
}

func registerChat(ctx context.Context, b *bot.Bot, chatCase *usecase.Chat, chatID int64) {
	tgchat, err := b.GetChat(ctx, &bot.GetChatParams{
		ChatID: chatID,
	})
	if err != nil {
		log.Printf("Error getting chat: %v", err)
	}

	chat := &domain.Chat{
		TelegramID: tgchat.ID,
		Name:       tgchat.Title,
	}
	if tgchat.Photo != nil {
		chat.Avatar = tgchat.Photo.BigFileID
	}

	err = chatCase.RegisterChat(ctx, chat)
	if err != nil {
		log.Printf("Error registering chat: %v", err)
	}

	_, err = b.SendMessage(ctx, &bot.SendMessageParams{
		ChatID: tgchat.ID,
		Text:   fmt.Sprintf("Hello, members of chat %s!\nChat is registered", tgchat.Title),
	})
	if err != nil {
		log.Printf("Error sending message: %v", err)
	}
}

func handleCommandTest(ctx context.Context, b *bot.Bot, update *models.Update) {
	_, err := b.SendMessage(ctx, &bot.SendMessageParams{
		ChatID: update.Message.Chat.ID,
		Text:   "Test command",
	})
	if err != nil {
		log.Printf("Error sending message: %v", err)
	}
}

func handleCommandRegister(chatCase *usecase.Chat) bot.HandlerFunc {
	return func(ctx context.Context, b *bot.Bot, update *models.Update) {
		_, err := b.SendMessage(ctx, &bot.SendMessageParams{
			ChatID: update.Message.Chat.ID,
			Text:   "Register command",
		})
		if err != nil {
			log.Printf("Error sending message: %v", err)
		}

		registerChat(ctx, b, chatCase, update.Message.Chat.ID)
	}
}
