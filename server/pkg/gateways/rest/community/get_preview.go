package community

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// GetPreview godoc
// @Summary Get community preview
// @Tags communities
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Community ID"
// @Success 200 {object} domain.Community "Community preview"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /communities/id/{id}/preview [get]
func GetPreview(communityCase *usecase.Community) gin.HandlerFunc {
	return func(c *gin.Context) {
		communityID := c.Param("id")
		user := middlewares.MustGetUser(c)

		community, err := communityCase.GetPreviewByID(usecase.NewContext(c, user), communityID)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get community preview") {
			return
		}

		c.JSON(http.StatusOK, community)
	}
}
