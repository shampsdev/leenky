package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// GetMe godoc
// @Summary Get me
// @Tags users
// @Accept json
// @Produce json
// @Schemes http https
// @Success 200 {object} domain.User "User data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /users/me [get]
func GetMe(userCase *usecase.User) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)

		user, err := userCase.GetMe(usecase.NewContext(c, user))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, user)
	}
}
