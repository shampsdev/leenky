package community

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

func Setup(r *gin.RouterGroup, cases usecase.Cases) {
	g := r.Group("/communities")

	g.
		Use(middlewares.ExtractUserTGData()).
		Use(middlewares.AuthUser(cases.User))

	g.
		GET("", GetPreviews(cases.Community)).
		GET("/search", Search(cases.Community, cases.Search))

	g.Group("/id/:id").
		GET("", GetByID(cases.Community)).
		POST("/join", Join(cases.Community)).
		POST("/leave", Leave(cases.Community)).
		GET("/preview", GetPreview(cases.Community))

	gM := g.Group("/id/:id/members")
	gM.
		GET("/search", SearchMembers(cases.Community, cases.Search)).
		GET("/:member_id", GetMember(cases.Community))
}
