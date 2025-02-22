package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// DeleteMe godoc
// @Summary Delete me
// @Tags users
// @Accept json
// @Produce json
// @Schemes http https
// @Success 200 {object} domain.User "User data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /users/me [delete]
func DeleteMe(userCase *usecase.User) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)

		err := userCase.DeleteUser(usecase.NewContext(c, user))
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to delete user") {
			return
		}

		c.JSON(http.StatusOK, user)
	}
}
