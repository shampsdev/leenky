package middlewares

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
	initdata "github.com/telegram-mini-apps/init-data-golang"
)

var BotToken string

func AuthTelegramID() gin.HandlerFunc {
	return func(c *gin.Context) {
		initData := c.GetHeader("X-API-Token")
		expIn := 1 * time.Hour
		err := initdata.Validate(initData, BotToken, expIn)
		if ginerr.AbortIfErr(c, err, http.StatusUnauthorized, "failed to validate initdata") {
			return
		}

		parsed, err := initdata.Parse(initData)
		if ginerr.AbortIfErr(c, err, http.StatusUnauthorized, "failed to parse initdata") {
			return
		}
		c.Set("user", &domain.User{
			TelegramID:       parsed.User.ID,
			TelegramUsername: parsed.User.Username,
			Avatar:           parsed.User.PhotoURL,
		})

		c.Next()
	}
}

func AuthUser(userCase *usecase.User) gin.HandlerFunc {
	return func(c *gin.Context) {
		tgID := MustGetUser(c).TelegramID
		user, err := userCase.GetUserByTelegramID(c, tgID)
		if ginerr.AbortIfErr(c, err, http.StatusUnauthorized, fmt.Sprintf("user with tg_id %d not found", tgID)) {
			return
		}
		c.Set("user", user)

		c.Next()
	}
}

func SetupAuth(r *gin.RouterGroup, userCase *usecase.User) {
	r.Use(AuthTelegramID())
	r.Use(AuthUser(userCase))
}

func MustGetUser(c *gin.Context) *domain.User {
	user, ok := c.MustGet("user").(*domain.User)
	if !ok {
		panic("user not found")
	}
	return user
}

func MustGetChatInstance(c *gin.Context) int64 {
	chatInstance, ok := c.MustGet("chat_instance").(int64)
	if !ok {
		panic("chat instance not found")
	}
	return chatInstance
}
