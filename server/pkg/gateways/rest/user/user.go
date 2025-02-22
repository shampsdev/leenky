package user

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

func Setup(r *gin.RouterGroup, cases usecase.Cases) {
	g := r.Group("/users")
	g.Use(middlewares.AuthTelegramID())
	g.POST("/", CreateMe(cases.User))

	gAuth := g.Group("")
	gAuth.Use(middlewares.AuthUser(cases.User))
	gAuth.GET("/:id", GetUser(cases.User))
	gAuth.PUT("/me", UpdateMe(cases.User))
	gAuth.GET("/me", GetMe(cases.User))
	gAuth.DELETE("/me", DeleteMe(cases.User))
}
