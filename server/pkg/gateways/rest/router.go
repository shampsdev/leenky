package rest

import (
	"context"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/docs"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/community"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/user"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func setupRouter(ctx context.Context, r *gin.Engine, useCases usecase.Cases) {
	r.HandleMethodNotAllowed = true
	r.Use(middlewares.AllowOrigin())
	r.Use(middlewares.Logger(ctx))

	v1 := r.Group("/api/v1")
	docs.SwaggerInfo.BasePath = "/api/v1"
	v1.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	community.Setup(v1, useCases)
	user.Setup(v1, useCases)
}
