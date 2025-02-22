package chat

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// GetChatPreviews godoc
// @Summary Get chat previews
// @Tags chats
// @Accept json
// @Produce json
// @Schemes http https
// @Success 200 {object} []domain.ChatPreview "Chats data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /chats [get]
func GetChatPreviews(chatCase *usecase.Chat) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)

		chats, err := chatCase.GetChatsPreview(usecase.NewContext(c, user))
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get chats") {
			return
		}
		c.JSON(http.StatusOK, chats)
	}
}
