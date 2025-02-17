package rest

import (
	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/docs"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/chat"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func setupRouter(r *gin.Engine, useCases usecase.Cases) {
	r.HandleMethodNotAllowed = true
	r.Use(middlewares.AllowOrigin())
	r.Use(middlewares.Logger())

	v1 := r.Group("/api/v1")
	docs.SwaggerInfo.BasePath = "/api/v1"
	v1.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	v1auth := v1.Group("")
	v1auth.Use(middlewares.Auth())
	chat.Setup(v1auth, useCases)
}
