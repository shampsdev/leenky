package chat

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// LeaveChat godoc
// @Summary Leave chat
// @Tags chats
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Chat ID"
// @Success 200
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /chats/{id}/leave [post]
func LeaveChat(chatCase *usecase.Chat) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		chatID := c.Param("id")

		err := chatCase.LeaveChat(usecase.NewContext(c, user), chatID)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.Status(http.StatusOK)
	}
}
