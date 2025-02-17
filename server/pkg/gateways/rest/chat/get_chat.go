package chat

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// GetChatByID godoc
// @Summary Get chat by ID
// @Tags chats
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Chat ID"
// @Success 200 {object} domain.Chat "Chat data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Router /chats/{id} [get]
func GetChatByID(chatCase *usecase.Chat) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		chatID := c.Param("id")

		chat, err := chatCase.GetChatByIDForUser(c, user.ID, chatID)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, chat)
	}
}
