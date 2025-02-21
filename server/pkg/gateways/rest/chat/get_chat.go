package chat

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// GetChat godoc
// @Summary Get chat
// @Tags chats
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Chat ID"
// @Success 200 {object} domain.Chat "Chat data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /chats/{id} [get]
func GetChat(chatCase *usecase.Chat) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		chatID := c.Param("id")

		chat, err := chatCase.GetChat(usecase.NewContext(c, user), chatID)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get chat") {
			return
		}

		c.JSON(http.StatusOK, chat)
	}
}
