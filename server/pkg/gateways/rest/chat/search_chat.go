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
// @Param q path string true "Search query"
// @Success 200 {object} []domain.User "Users"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /chats/{id}/search [get]
func SearchChat(search *usecase.Search) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		chatID := c.Param("id")
		q := c.Param("q")

		users, err := search.SearchInChat(usecase.NewContext(c, user), chatID, q)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to search chat") {
			return
		}
		c.JSON(http.StatusOK, users)
	}
}
