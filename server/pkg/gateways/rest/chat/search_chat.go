package chat

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// SearchChat godoc
// @Summary Search users in chat
// @Tags chats
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Chat ID"
// @Param q query string false "Search query"
// @Success 200 {object} []domain.User "Users"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /chats/{id}/search [get]
func SearchChat(chatCase *usecase.Chat, search *usecase.Search) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		chatID := c.Param("id")
		q := c.Param("q")

		if q == "" {
			users, err := chatCase.GetChatUsers(usecase.NewContext(c, user), chatID)
			if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get chat users") {
				return
			}
			c.JSON(http.StatusOK, users)
			return
		}

		users, err := search.SearchInChat(usecase.NewContext(c, user), chatID, q)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to search chat") {
			return
		}
		c.JSON(http.StatusOK, users)
	}
}
