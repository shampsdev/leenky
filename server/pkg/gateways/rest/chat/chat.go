package chat

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

func Setup(r *gin.RouterGroup, cases usecase.Cases) {
	g := r.Group("/chats")
	middlewares.SetupAuth(g, cases.User)

	g.GET("/:id", GetChatByID(cases.Chat))
	g.GET("/", GetChats(cases.Chat))
	g.POST("/:id/join", JoinChat(cases.Chat))
}
