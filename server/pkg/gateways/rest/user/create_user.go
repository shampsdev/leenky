package user

import (
	"net/http"

	log "github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/domain"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// CreateUser godoc
// @Summary Create user
// @Tags users
// @Accept json
// @Produce json
// @Schemes http https
// @Param user body domain.User true "User data"
// @Success 200 {object} domain.User "User data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /users [post]
func CreateUser(userCase *usecase.User) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)

		toCreate := &domain.User{}
		if err := c.ShouldBindJSON(toCreate); err != nil {
			log.WithError(err).Error("failed to bind user")
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		err := userCase.CreateUser(usecase.NewContext(c, user), toCreate)
		if err != nil {
			log.WithError(err).Error("failed to create user")
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		c.Status(http.StatusCreated)
	}
}
