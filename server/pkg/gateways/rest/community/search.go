package community

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// Search godoc
// @Summary Search communities
// @Tags communities
// @Accept json
// @Produce json
// @Schemes http https
// @Param q query string false "Search query"
// @Success 200 {object} []domain.Community "Communities"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /communities/search [get]
func Search(communityCase *usecase.Community, search *usecase.Search) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		q := c.Query("q")

		if q == "" {
			communities, err := communityCase.GetPreviews(usecase.NewContext(c, user))
			if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get communities") {
				return
			}
			c.JSON(http.StatusOK, communities)
			return
		}

		communities, err := search.SearchCommunities(usecase.NewContext(c, user), q)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to search communities") {
			return
		}
		c.JSON(http.StatusOK, communities)
	}
}
