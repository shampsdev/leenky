package community

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// Patch godoc
// @Summary Patch community
// @Tags communities
// @Accept json
// @Produce json
// @Schemes http https
// @Param community body domain.PatchCommunity true "Community data"
// @Success 200 {object} domain.Community "Community data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /communities/id/{id} [patch]
func Patch(communityCase *usecase.Community) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		communityID := c.Param("id")
		var patchCommunity domain.PatchCommunity
		if ginerr.AbortIfErr(c, c.ShouldBindJSON(&patchCommunity), http.StatusBadRequest, "failed to bind json") {
			return
		}
		patchCommunity.ID = communityID

		community, err := communityCase.Patch(usecase.NewContext(c, user), &patchCommunity)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to patch community") {
			return
		}

		c.JSON(http.StatusOK, community)
	}
}
