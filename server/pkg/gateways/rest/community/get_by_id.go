package community

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// GetByID godoc
// @Summary Get community
// @Tags communities
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Community ID"
// @Success 200 {object} domain.Community "Community data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /communities/id/{id} [get]
func GetByID(communityCase *usecase.Community) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		communityID := c.Param("id")

		community, err := communityCase.GetByID(usecase.NewContext(c, user), communityID)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get community") {
			return
		}

		c.JSON(http.StatusOK, community)
	}
}
