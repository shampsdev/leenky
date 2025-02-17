package chat

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// GetChats godoc
// @Summary Get chats for user
// @Tags chats
// @Accept json
// @Produce json
// @Schemes http https
// @Success 200 {object} []domain.Chat "Chats data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Router /chats [get]
func GetChats(chatCase *usecase.Chat) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)

		chat, err := chatCase.GetChatsForUser(c, user.ID)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, chat)
	}
}
