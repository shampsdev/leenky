package chat

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

func Setup(r *gin.RouterGroup, cases usecase.Cases) {
	g := r.Group("/chats")
	g.Use(middlewares.AuthTelegramID())
	g.GET("/:id/preview", GetChatPreview(cases.Chat))

	gAuth := g.Group("")
	gAuth.Use(middlewares.AuthUser(cases.User))
	gAuth.
		GET("", GetChatPreviews(cases.Chat)).
		GET("/search", SearchChats(cases.Chat, cases.Search))

	gAuth.Group("/id/:id").
		GET("", GetChat(cases.Chat)).
		POST("/join", JoinChat(cases.Chat)).
		POST("/leave", LeaveChat(cases.Chat)).
		GET("/search", SearchInChat(cases.Chat, cases.Search))
}
