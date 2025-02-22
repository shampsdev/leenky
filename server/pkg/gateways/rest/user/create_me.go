package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// CreateMe godoc
// @Summary Create me
// @Tags users
// @Accept json
// @Produce json
// @Schemes http https
// @Param user body domain.EditUser true "User data"
// @Success 200 {object} domain.User "User data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /users/me [post]
func CreateMe(userCase *usecase.User) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)

		toCreate := &domain.EditUser{}
		if err := c.ShouldBindJSON(toCreate); ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to bind user") {
			return
		}

		user, err := userCase.CreateUser(usecase.NewContext(c, user), toCreate)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to create user") {
			return
		}

		c.JSON(http.StatusCreated, user)
	}
}
