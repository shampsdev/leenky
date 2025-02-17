package chat

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

func Setup(r *gin.RouterGroup, cases usecase.Cases) {
	g := r.Group("/chats")
	g.GET("/:id", GetChatByID(cases.Chat))
	g.GET("/", GetChats(cases.Chat))
}
