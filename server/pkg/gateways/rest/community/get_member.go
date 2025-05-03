package community

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// GetMember godoc
// @Summary Get member
// @Tags communities
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Community ID"
// @Param member_id path string true "Member id"
// @Success 200 {object} domain.Member "Member"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /communities/id/{id}/members/{member_id} [get]
func GetMember(communityCase *usecase.Community) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		communityID := c.Param("id")
		memberID := c.Param("member_id")

		member, err := communityCase.GetMember(usecase.NewContext(c, user), communityID, memberID)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get member") {
			return
		}

		c.JSON(http.StatusOK, member)
	}
}
