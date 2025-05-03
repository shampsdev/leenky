package community

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// SearchMembers godoc
// @Summary Search members
// @Tags communities
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Community ID"
// @Param q query string false "Search query"
// @Success 200 {object} []domain.Member "Members"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /communities/id/{id}/members/search [get]
func SearchMembers(communityCase *usecase.Community, search *usecase.Search) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		communityID := c.Param("id")
		q := c.Query("q")

		if q == "" {
			community, err := communityCase.GetByID(usecase.NewContext(c, user), communityID)
			if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get community") {
				return
			}
			c.JSON(http.StatusOK, community.Members)
			return
		}

		users, err := search.SearchMembers(usecase.NewContext(c, user), communityID, q)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to search members") {
			return
		}
		c.JSON(http.StatusOK, users)
	}
}
