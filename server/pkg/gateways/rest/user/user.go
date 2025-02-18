package user

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

func Setup(r *gin.RouterGroup, cases usecase.Cases) {
	g := r.Group("/users")
	g.Use(middlewares.AuthTelegramID())
	g.POST("/", CreateUser(cases.User))

	gAuth := g.Group("")
	gAuth.Use(middlewares.AuthUser(cases.User))
	gAuth.GET("/:id", GetUserByID(cases.User))
	gAuth.PUT("/", UpdateUser(cases.User))
}
