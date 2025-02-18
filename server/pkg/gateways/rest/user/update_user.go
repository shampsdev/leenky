package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"

	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// UpdateUser godoc
// @Summary Update user by ID
// @Tags users
// @Accept json
// @Produce json
// @Schemes http https
// @Param user body domain.User true "User data"
// @Success 200 {object} domain.User "User data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /users [put]
func UpdateUser(userCase *usecase.User) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)

		toUpdate := &domain.User{}
		if err := c.ShouldBindJSON(toUpdate); err != nil {
			log.WithError(err).Error("failed to bind user")
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		newUser, err := userCase.UpdateUser(usecase.NewContext(c, user), toUpdate)
		if err != nil {
			log.WithError(err).Error("failed to get user by id")
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		c.JSON(http.StatusOK, newUser)
	}
}
