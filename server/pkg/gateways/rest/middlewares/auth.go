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

func ExtractUserTGData() gin.HandlerFunc {
	return func(c *gin.Context) {
		initData := c.GetHeader("X-API-Token")
		expIn := 2 * time.Hour
		err := initdata.Validate(initData, BotToken, expIn)
		if ginerr.AbortIfErr(c, err, http.StatusUnauthorized, "failed to validate initdata") {
			return
		}

		parsed, err := initdata.Parse(initData)
		if ginerr.AbortIfErr(c, err, http.StatusUnauthorized, "failed to parse initdata") {
			return
		}
		c.Set("user_tg_data", &domain.UserTGData{
			TelegramID:       parsed.User.ID,
			FirstName:        parsed.User.FirstName,
			LastName:         parsed.User.LastName,
			TelegramUsername: parsed.User.Username,
			Avatar:           parsed.User.PhotoURL,
		})

		c.Next()
	}
}

func AuthUser(userCase *usecase.User) gin.HandlerFunc {
	return func(c *gin.Context) {
		tgUser := MustGetUserTGData(c)
		user, err := userCase.GetUserByTGData(c, tgUser)
		if ginerr.AbortIfErr(c, err, http.StatusUnauthorized, fmt.Sprintf("user with tg_id %d not found", tgUser.TelegramID)) {
			return
		}
		c.Set("user", user)

		c.Next()
	}
}

func SetupAuth(r *gin.RouterGroup, userCase *usecase.User) {
	r.Use(ExtractUserTGData(), AuthUser(userCase))
}

func MustGetUser(c *gin.Context) *domain.User {
	user, ok := c.MustGet("user").(*domain.User)
	if !ok {
		panic("user not found")
	}
	return user
}

func MustGetUserTGData(c *gin.Context) *domain.UserTGData {
	user, ok := c.MustGet("user_tg_data").(*domain.UserTGData)
	if !ok {
		panic("user not found")
	}
	return user
}
