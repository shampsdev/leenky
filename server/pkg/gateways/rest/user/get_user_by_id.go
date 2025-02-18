package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"

	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// GetUserByID godoc
// @Summary Get user by ID
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
func GetUserByID(userCase *usecase.User) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		userID := c.Param("id")

		user, err := userCase.GetUserByID(usecase.NewContext(c, user), userID)
		if err != nil {
			log.WithError(err).Error("failed to get user by id")
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		c.JSON(http.StatusOK, user)
	}
}
