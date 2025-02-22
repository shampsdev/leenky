package chat

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// GetChatPreview godoc
// @Summary Get chat preview
// @Tags chats
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Chat ID"
// @Success 200 {object} domain.ChatPreview "Chat data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /chats/id/{id}/preview [get]
func GetChatPreview(chatCase *usecase.Chat) gin.HandlerFunc {
	return func(c *gin.Context) {
		userTGData := middlewares.MustGetUserTGData(c)
		chatID := c.Param("id")

		chat, err := chatCase.GetChatPreview(c, userTGData.TelegramID, chatID)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get chat preview") {
			return
		}

		c.JSON(http.StatusOK, chat)
	}
}
