package community

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// Create godoc
// @Summary Create community
// @Tags communities
// @Accept json
// @Produce json
// @Schemes http https
// @Param community body domain.CreateCommunity true "Community data"
// @Success 200 {object} domain.Community "Community data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /communities [post]
func Create(communityCase *usecase.Community) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		var createCommunity domain.CreateCommunity
		if ginerr.AbortIfErr(c, c.ShouldBindJSON(&createCommunity), http.StatusBadRequest, "failed to bind json") {
			return
		}

		community, err := communityCase.Create(usecase.NewContext(c, user), &createCommunity)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to create community") {
			return
		}

		c.JSON(http.StatusOK, community)
	}
}
