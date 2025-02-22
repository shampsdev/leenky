package tg

import (
	"context"
	"fmt"

	"github.com/go-telegram/bot"
	"github.com/go-telegram/bot/models"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/tglinked/server/cmd/config"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
	log "github.com/sirupsen/logrus"
)

type Bot struct {
	*bot.Bot
	cases usecase.Cases
	log   *log.Logger

	botUrl    string
	webAppUrl string
}

func NewBot(cfg *config.Config, pool *pgxpool.Pool) (*Bot, error) {
	opts := []bot.Option{}

	if cfg.Debug {
		opts = append(opts, bot.WithDebug())
	}
	tgb, err := bot.New(cfg.TG.BotToken, opts...)
	if err != nil {
		return nil, fmt.Errorf("error creating bot: %w", err)
	}
	cases := usecase.Setup(cfg, pool, tgb)

	b := &Bot{
		Bot:   tgb,
		cases: cases,
		log:   log.New(),
	}

	me, err := b.GetMe(context.Background())
	if err != nil {
		return nil, fmt.Errorf("error getting bot info: %w", err)
	}
	b.webAppUrl = fmt.Sprintf("https://t.me/%s/%s", me.Username, cfg.TG.WebAppName)
	b.botUrl = fmt.Sprintf("https://t.me/%s", me.Username)

	return b, nil
}

func (b *Bot) Run(ctx context.Context) {
	_, err := b.SetMyCommands(ctx, &bot.SetMyCommandsParams{
		Commands: []models.BotCommand{
			{
				Command:     "register",
				Description: "Register chat",
			},
		},
	})
	if err != nil {
		panic(fmt.Errorf("error setting bot commands: %w", err))
	}

	b.RegisterHandlerMatchFunc(func(update *models.Update) bool {
		return update.MyChatMember != nil
	}, b.handleMyChatMember)

	b.RegisterHandler(bot.HandlerTypeMessageText, "/register", bot.MatchTypePrefix, b.handleCommandRegister)
	b.RegisterHandler(bot.HandlerTypeMessageText, "/start", bot.MatchTypeExact, b.handleCommandStart)

	b.RegisterHandlerMatchFunc(func(update *models.Update) bool {
		return update.Message != nil &&
			(len(update.Message.NewChatPhoto) != 0 || update.Message.NewChatTitle != "")
	}, b.handleChatChanged)

	b.Start(ctx)
}

func (b *Bot) handleCommandRegister(ctx context.Context, _ *bot.Bot, update *models.Update) {
	err := b.registerChat(ctx, update.Message.Chat.ID)
	if err != nil {
		b.log.Errorf("error registering chat: %v", err)
	}
}

func (b *Bot) handleCommandStart(ctx context.Context, _ *bot.Bot, update *models.Update) {
	_, err := b.SendMessage(ctx, &bot.SendMessageParams{
		ChatID: update.Message.Chat.ID,
		Text: `*Как начать пользоваться Leenky?*

1\. Откройте приложение
2\. Заполните свой профиль 
3\. Добавьте бота в чат

Используйте дополнительные *команды* для управления ботом в чате\. Для этого напишите "/" в нужный чат и выберите команду из открывшегося списка\.`,
		ParseMode: models.ParseModeMarkdown,
		ReplyMarkup: &models.InlineKeyboardMarkup{
			InlineKeyboard: [][]models.InlineKeyboardButton{
				{
					{
						Text: "⭐️ Открыть",
						URL:  b.webAppUrl,
					},
					{
						Text: "⭐️ Добавить в чат",
						URL:  fmt.Sprintf("%s?startgroup=", b.botUrl),
					},
				},
			},
		},
	})
	if err != nil {
		b.log.Errorf("error sending message: %v", err)
	}
}

func (b *Bot) handleMyChatMember(ctx context.Context, _ *bot.Bot, update *models.Update) {
	mcm := update.MyChatMember
	err := b.registerChat(ctx, mcm.Chat.ID)
	if err != nil {
		b.log.Errorf("error registering chat: %v", err)
	}
}

func (b *Bot) handleChatChanged(ctx context.Context, _ *bot.Bot, update *models.Update) {
	_, err := b.cases.Chat.CreateOrUpdateChat(ctx, update.Message.Chat.ID)
	if err != nil {
		b.log.Errorf("error registering chat: %v", err)
	}

	_, err = b.SendMessage(ctx, &bot.SendMessageParams{
		ChatID: update.Message.Chat.ID,
		Text:   "О, у вас тут перемены? Запомнил 😉",
	})
	if err != nil {
		b.log.Errorf("error sending message: %v", err)
	}
}

func (b *Bot) registerChat(ctx context.Context, chatID int64) error {
	chat, err := b.cases.Chat.CreateOrUpdateChat(ctx, chatID)
	if err != nil {
		return fmt.Errorf("error registering chat: %w", err)
	}

	msg, err := b.SendMessage(ctx, &bot.SendMessageParams{
		ChatID: chat.TelegramID,
		Text: fmt.Sprintf(
			`Привет коллеги из "%s"!
Ваш чат привязан к сети
Нажмите [Open] и подтвердите участие`, chat.Name),
		ReplyMarkup: models.InlineKeyboardMarkup{
			InlineKeyboard: [][]models.InlineKeyboardButton{{{
				Text: "Open",
				URL:  b.urlForChat(chat.ID),
			}}},
		},
	})
	if err != nil {
		return fmt.Errorf("error sending message: %w", err)
	}

	_, err = b.PinChatMessage(ctx, &bot.PinChatMessageParams{
		ChatID:    chat.TelegramID,
		MessageID: msg.ID,
	})
	if err != nil {
		return fmt.Errorf("error pinning message: %w", err)
	}

	return nil
}

func (b *Bot) urlForChat(chatID string) string {
	return fmt.Sprintf("%s?startapp=%s", b.webAppUrl, chatID)
}
