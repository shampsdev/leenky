package community

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// GetPreviews godoc
// @Summary Get community previews
// @Tags communities
// @Accept json
// @Produce json
// @Schemes http https
// @Success 200 {object} []domain.Community "Communities data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /communities [get]
func GetPreviews(communityCase *usecase.Community) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)

		communities, err := communityCase.GetPreviews(usecase.NewContext(c, user))
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get communities") {
			return
		}
		c.JSON(http.StatusOK, communities)
	}
}
