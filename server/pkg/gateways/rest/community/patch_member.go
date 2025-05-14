package community

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// PatchMember godoc
// @Summary Patch member
// @Tags communities
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "Community ID"
// @Param member_id path string true "Member ID"
// @Param config body domain.PatchMember true "Community config"
// @Success 200
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /communities/id/{id}/members/id/{member_id} [patch]
func PatchMember(communityCase *usecase.Community) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		config := &domain.PatchMember{}
		err := c.ShouldBindJSON(config)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to bind config") {
			return
		}
		communityID := c.Param("id")
		config.CommunityID = communityID
		memberID := c.Param("member_id")
		config.UserID = memberID
		err = communityCase.PatchMember(usecase.NewContext(c, user), communityID, config)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to patch member") {
			return
		}
		c.Status(http.StatusOK)
	}
}
