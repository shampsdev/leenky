package user

import (
	"net/http"

	"github.com/gin-gonic/gin"

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
// @Param user body domain.EditUser true "User data"
// @Success 200 {object} domain.User "User data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /users [put]
func UpdateUser(userCase *usecase.User) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)

		toUpdate := &domain.EditUser{}
		if err := c.ShouldBindJSON(toUpdate); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		newUser, err := userCase.UpdateUser(usecase.NewContext(c, user), user.ID, toUpdate)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, newUser)
	}
}
