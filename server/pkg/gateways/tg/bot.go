package tg

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strings"
	"time"

	"github.com/go-telegram/bot"
	"github.com/go-telegram/bot/models"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shampsdev/tglinked/server/cmd/config"
	"github.com/shampsdev/tglinked/server/pkg/repo"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
	"github.com/shampsdev/tglinked/server/pkg/utils/slogx"
)

type Bot struct {
	*bot.Bot
	cases usecase.Cases
	log   *slog.Logger

	botUrl    string
	webAppUrl string

	supergroupDelay time.Duration
}

func NewBot(ctx context.Context, cfg *config.Config, pool *pgxpool.Pool) (*Bot, error) {
	opts := []bot.Option{}

	if cfg.Debug {
		opts = append(opts, bot.WithDebug())
	}
	tgb, err := bot.New(cfg.TG.BotToken, opts...)
	if err != nil {
		return nil, fmt.Errorf("error creating bot: %w", err)
	}
	cases := usecase.Setup(ctx, cfg, pool, tgb)

	b := &Bot{
		Bot:   tgb,
		cases: cases,
		log:   slogx.FromCtx(ctx),

		supergroupDelay: 5 * time.Second,
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
		Commands: []models.BotCommand{},
	})
	if err != nil {
		panic(fmt.Errorf("error setting bot commands: %w", err))
	}

	b.RegisterHandlerMatchFunc(func(update *models.Update) bool {
		return update.MyChatMember != nil
	}, b.handleMyChatMember)

	b.RegisterHandler(bot.HandlerTypeMessageText, "/register", bot.MatchTypePrefix, b.handleCommandRegister)
	b.RegisterHandler(bot.HandlerTypeMessageText, "/start", bot.MatchTypeExact, b.handleCommandStart)
	b.RegisterHandler(bot.HandlerTypeMessageText, "/link", bot.MatchTypeExact, b.handleCommandLink)
	b.RegisterHandler(bot.HandlerTypeMessageText, "/connect", bot.MatchTypePrefix, b.handleCommandConnect)

	b.RegisterHandlerMatchFunc(func(update *models.Update) bool {
		return update.Message != nil && update.Message.MigrateFromChatID != 0
	}, b.handleMigrate)

	b.RegisterHandlerMatchFunc(func(update *models.Update) bool {
		return update.Message != nil &&
			(len(update.Message.NewChatPhoto) != 0 || update.Message.NewChatTitle != "" || update.Message.DeleteChatPhoto)
	}, b.handleChatChanged)

	b.Start(ctx)
}

func (b *Bot) handleCommandRegister(ctx context.Context, _ *bot.Bot, update *models.Update) {
	chatMember, err := b.GetChatMember(ctx, &bot.GetChatMemberParams{
		ChatID: update.Message.Chat.ID,
		UserID: update.Message.From.ID,
	})
	log := b.log.With("chat_id", update.Message.Chat.ID, "user_id", update.Message.From.ID)

	if err != nil {
		slogx.WithErr(log, err).Error("error getting chat member")
		return
	}
	if chatMember.Administrator == nil && chatMember.Owner == nil {
		_, err := b.SendMessage(ctx, &bot.SendMessageParams{
			ChatID: update.Message.Chat.ID,
			Text:   "Команда /register доступна только администраторам 🤨",
		})
		if err != nil {
			slogx.WithErr(log, err).Error("error sending message")
		}
		return
	}

	msg := update.Message
	if msg.Chat.Type != models.ChatTypeGroup && msg.Chat.Type != models.ChatTypeSupergroup {
		_, err := b.SendMessage(ctx, &bot.SendMessageParams{
			ChatID:    update.Message.Chat.ID,
			Text:      "Команда `/register` доступна только в чатах, поскорее добавь меня туда 👁️🫦👁️",
			ParseMode: models.ParseModeMarkdown,

			ReplyMarkup: &models.InlineKeyboardMarkup{
				InlineKeyboard: [][]models.InlineKeyboardButton{
					{
						{
							Text: "⭐️ Добавить в чат",
							URL:  fmt.Sprintf("%s?startgroup=", b.botUrl),
						},
					},
				},
			},
		})
		if err != nil {
			slogx.WithErr(log, err).Error("error sending message")
		}
		return
	}
	err = b.registerChat(ctx, msg.Chat.ID)
	if err != nil {
		slogx.WithErr(log, err).Error("error registering chat")
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
		slogx.FromCtxWithErr(ctx, err).Error("error sending message")
	}
}

func (b *Bot) handleCommandLink(ctx context.Context, _ *bot.Bot, update *models.Update) {
	tgChatID := update.Message.Chat.ID
	log := slogx.FromCtx(ctx).With("tg_chat_id", tgChatID)
	chat, err := b.cases.Community.GetPreviewByTGID(ctx, tgChatID)
	if err != nil {
		log.Error("error getting chat", slogx.Err(err))
		return
	}
	log = log.With("chat_id", chat.ID)

	_, err = b.SendMessage(ctx, &bot.SendMessageParams{
		ChatID:    tgChatID,
		Text:      fmt.Sprintf("По этой ссылке можно вступить в наше комьюнити <b>%s</b>!\n 👉 %s 👈", chat.Name, b.urlForChat(chat.ID)),
		ParseMode: models.ParseModeHTML,
	})
	if err != nil {
		log.Error("error sending message", slogx.Err(err))
	}
}

func (b *Bot) handleMyChatMember(ctx context.Context, _ *bot.Bot, update *models.Update) {
	mcm := update.MyChatMember
	log := slogx.FromCtx(ctx).With("tg_chat_id", mcm.Chat.ID)

	if !(mcm.NewChatMember.Type == models.ChatMemberTypeBanned || mcm.NewChatMember.Type == models.ChatMemberTypeLeft) {
		// if bot wasn't in chat
		if mcm.OldChatMember.Type == models.ChatMemberTypeLeft ||
			mcm.OldChatMember.Type == models.ChatMemberTypeBanned {

			// if chat is supergroup, there is a change, that it migrated from known chat
			// so we need to wait for possible migrate event
			if mcm.Chat.Type == models.ChatTypeSupergroup {
				go func() {
					log.Info("waiting for migrate event")
					time.Sleep(b.supergroupDelay)

					_, err := b.cases.Community.GetPreviewByTGID(ctx, mcm.Chat.ID)

					if errors.Is(err, repo.ErrNotFound) {
						log.Info("chat not found, registering chat")
						err := b.registerChat(ctx, mcm.Chat.ID)
						if err != nil {
							log.With(slogx.Err(err)).Error("error registering chat")
						}
						return
					}

					if err != nil {
						log.With(slogx.Err(err)).Error("error getting chat")
						return
					}
					log.Info("chat found, not registering chat")
				}()
				return
			}

			err := b.registerChat(ctx, mcm.Chat.ID)
			if err != nil {
				log.With(slogx.Err(err)).Error("error registering chat")
			}
		}
	}
}

func (b *Bot) handleCommandConnect(ctx context.Context, _ *bot.Bot, update *models.Update) {
	msg := update.Message
	log := slogx.FromCtx(ctx).With("tg_chat_id", msg.Chat.ID, "tg_chat_title", msg.Chat.Title)
	communityID := strings.TrimPrefix(msg.Text, "/connect ")
	err := b.cases.Community.ConnectCommunityWithTGChat(ctx, msg.From.ID, communityID, msg.Chat.ID)
	if err != nil {
		log.With(slogx.Err(err)).Error("error connecting chat")
		_, err = b.SendMessage(ctx, &bot.SendMessageParams{
			ChatID: msg.Chat.ID,
			Text: `Не удалось подключить чат к вашему комьюнити 😢
- Может быть вы не администратор?
- А может чат уже подключен?`,
		})
		if err != nil {
			log.With(slogx.Err(err)).Error("error sending message")
		}
		return
	}
	log.Info("chat connected")

	_, err = b.SendMessage(ctx, &bot.SendMessageParams{
		ChatID: msg.Chat.ID,
		Text:   "Чат подключен к вашему комьюнити 🎉",
	})
	if err != nil {
		log.With(slogx.Err(err)).Error("error sending message")
	}
	err = b.registerChat(ctx, msg.Chat.ID)
	if err != nil {
		log.With(slogx.Err(err)).Error("error sending message")
	}
}

func (b *Bot) handleMigrate(ctx context.Context, _ *bot.Bot, update *models.Update) {
	fromChatID := update.Message.MigrateFromChatID
	toChatID := update.Message.Chat.ID

	err := b.cases.Community.MigrateTGChatID(ctx, fromChatID, toChatID)
	if err != nil {
		slogx.FromCtxWithErr(ctx, err).Error("error changing chat telegram id")
	}
	slogx.Info(ctx, "chat migrated", "from", fromChatID, "to", toChatID)
}

func (b *Bot) handleChatChanged(ctx context.Context, _ *bot.Bot, update *models.Update) {
	err := b.cases.Community.SyncCommunityWithTGChat(ctx, update.Message.Chat.ID)
	if err != nil {
		slogx.FromCtxWithErr(ctx, err).Error("error syncing community with tg chat")
		return
	}

	_, err = b.SendMessage(ctx, &bot.SendMessageParams{
		ChatID: update.Message.Chat.ID,
		Text:   "О, у вас тут перемены? Запомнил 😉",
	})
	if err != nil {
		slogx.FromCtxWithErr(ctx, err).Error("error sending message")
	}
}

func (b *Bot) registerChat(ctx context.Context, chatID int64) error {
	community, err := b.cases.Community.GetPreviewByTGID(ctx, chatID)
	if err != nil {
		return fmt.Errorf("error getting chat: %w", err)
	}

	msg, err := b.SendPhoto(ctx, &bot.SendPhotoParams{
		ChatID: *community.TGChatID,
		Photo: &models.InputFileString{
			Data: "https://s3.ru1.storage.beget.cloud/f5732312921d-shampsdev/tglinked/assets/joinchat.jpg",
		},
		Caption: `*Привет, это Leenky — ваша сеть полезных контактов\!* 👋

Я помогу вам лучше узнать людей в этом чате\! Расскажите о себе и расширьте круг полезных знакомств\.

Чтобы узнать больше об участниках чата, откройте приложение по кнопке ниже\.

*Не забудьте закрепить это сообщение* 📌`,
		ParseMode: models.ParseModeMarkdown,
		ReplyMarkup: models.InlineKeyboardMarkup{
			InlineKeyboard: [][]models.InlineKeyboardButton{{{
				Text: "Открыть",
				URL:  b.urlForChat(community.ID),
			}}},
		},
	})
	if err != nil {
		return fmt.Errorf("error sending message: %w", err)
	}

	_, err = b.PinChatMessage(ctx, &bot.PinChatMessageParams{
		ChatID:    *community.TGChatID,
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
