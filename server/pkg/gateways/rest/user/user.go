package user

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

func Setup(r *gin.RouterGroup, cases usecase.Cases) {
	g := r.Group("/users")
	g.Use(middlewares.ExtractUserTGData())
	g.POST("/me", CreateMe(cases.User))
	g.GET("/me/preview", GetMePreview(cases.User))

	gAuth := g.Group("")
	gAuth.Use(middlewares.AuthUser(cases.User))
	gAuth.GET("/id/:id", GetUser(cases.User))
	gAuth.Group("/me").
		PUT("", UpdateMe(cases.User)).
		GET("", GetMe(cases.User)).
		DELETE("", DeleteMe(cases.User))
}
