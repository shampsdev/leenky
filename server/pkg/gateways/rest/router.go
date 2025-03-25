package rest

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/cmd/config"
	"github.com/shampsdev/tglinked/server/docs"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/chat"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/user"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func setupRouter(ctx context.Context, cfg *config.Config, r *gin.Engine, useCases usecase.Cases) {
	r.HandleMethodNotAllowed = true
	r.Use(middlewares.AllowOrigin())
	r.Use(middlewares.Logger(ctx))

	v1 := r.Group("/api/v1")
	docs.SwaggerInfo.BasePath = "/api/v1"
	v1.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	chat.Setup(v1, useCases)
	user.Setup(v1, useCases)

	r.GET(
		fmt.Sprintf("/%s/*filepath", cfg.Storage.ImagesPath),
		gin.WrapH(http.StripPrefix(
			fmt.Sprintf("/%s/", cfg.Storage.ImagesPath),
			http.FileServer(gin.Dir(cfg.Storage.ImagesPath, false)),
		)),
	)
}
