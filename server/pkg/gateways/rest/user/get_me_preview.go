package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

// GetMePreview godoc
// @Summary Get me preview
// @Description Use for bio extraction
// @Tags users
// @Accept json
// @Produce json
// @Schemes http https
// @Success 200 {object} domain.UserPreview "User data"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /users/me/preview [get]
func GetMePreview(userCase *usecase.User) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUserTGData(c)
		p, err := userCase.GetMePreview(c, user)
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get user") {
			return
		}

		c.JSON(http.StatusCreated, p)
	}
}
