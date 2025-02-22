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
	gAuth.GET("/:id", GetChat(cases.Chat))
	gAuth.GET("/", GetChatPreviews(cases.Chat))
	gAuth.POST("/:id/join", JoinChat(cases.Chat))
	gAuth.POST("/:id/leave", LeaveChat(cases.Chat))
	gAuth.POST("/search", SearchChats(cases.Chat, cases.Search))
	gAuth.GET("/:id/search", SearchInChat(cases.Chat, cases.Search))
}
