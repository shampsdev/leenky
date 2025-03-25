package chat

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// SearchChats godoc
// @Summary Search chats
// @Tags chats
// @Accept json
// @Produce json
// @Schemes http https
// @Param q query string false "Search query"
// @Success 200 {object} []domain.ChatPreview "Chats"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /chats/search [get]
func SearchChats(chatCase *usecase.Chat, search *usecase.Search) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		q := c.Query("q")

		if q == "" {
			chats, err := chatCase.GetChatsPreview(usecase.NewContext(c, user))
			if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get chats") {
				return
			}
			c.JSON(http.StatusOK, chats)
			return
		}

		chats, err := search.SearchChats(usecase.NewContext(c, user), q)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to search chat") {
			return
		}
		c.JSON(http.StatusOK, chats)
	}
}
