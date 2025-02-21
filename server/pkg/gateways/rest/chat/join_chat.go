package chat

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// JoinChat godoc
// @Summary Join to chat
// @Tags chats
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Chat ID"
// @Success 200
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /chats/{id}/join [post]
func JoinChat(chatCase *usecase.Chat) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		chatID := c.Param("id")

		err := chatCase.JoinChat(usecase.NewContext(c, user), chatID)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to join chat") {
			return
		}

		c.Status(http.StatusOK)
	}
}
