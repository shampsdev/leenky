package user

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// GetUser godoc
// @Summary Get user
// @Tags users
// @Accept json
// @Produce json
// @Schemes http https
// @Param id path string true "User ID"
// @Success 200 {object} domain.User "User data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /users/{id} [get]
func GetUser(userCase *usecase.User) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		userID := c.Param("id")

		user, err := userCase.GetUserByID(usecase.NewContext(c, user), userID)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get user") {
			return
		}

		c.JSON(http.StatusOK, user)
	}
}
