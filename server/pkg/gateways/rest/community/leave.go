package community

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// Leave godoc
// @Summary Leave community
// @Tags communities
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "community ID"
// @Success 200
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /communities/id/{id}/leave [post]
func Leave(communityCase *usecase.Community) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		communityID := c.Param("id")

		err := communityCase.LeaveCommunity(usecase.NewContext(c, user), communityID)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to leave community") {
			return
		}

		c.Status(http.StatusOK)
	}
}
