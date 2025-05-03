package community

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// Join godoc
// @Summary Join to community
// @Tags communities
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Community ID"
// @Param config body domain.MemberConfig true "Community config"
// @Success 200
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /communities/id/{id}/join [post]
func Join(communityCase *usecase.Community) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		communityID := c.Param("id")
		var config *domain.MemberConfig
		err := c.ShouldBindJSON(config)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to bind config") {
			return
		}

		err = communityCase.JoinCommunity(usecase.NewContext(c, user), communityID, config)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to join community") {
			return
		}

		c.Status(http.StatusOK)
	}
}
