package user

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// UpdateMe godoc
// @Summary Update me
// @Tags users
// @Accept json
// @Produce json
// @Schemes http https
// @Param user body domain.PatchMe true "User data"
// @Success 200 {object} domain.User "User data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /users/me [put]
func UpdateMe(userCase *usecase.User) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)

		patchMe := &domain.PatchMe{}
		err := c.ShouldBindJSON(patchMe)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to bind user") {
			return
		}
		patchMe.ID = user.ID

		newUser, err := userCase.Patch(c, patchMe.ToPatchUser())
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to update user") {
			return
		}

		c.JSON(http.StatusOK, newUser)
	}
}
