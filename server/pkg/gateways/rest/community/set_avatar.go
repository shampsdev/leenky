package community

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/ginerr"
	"github.com/shampsdev/tglinked/server/pkg/gateways/rest/middlewares"
	"github.com/shampsdev/tglinked/server/pkg/usecase"
)

type SetAvatarResponse struct {
	URL string `json:"url"`
}

// SetAvatar godoc
// @Summary Set avatar for community
// @Tags communities
// @Accept json
// @Produce json
// @Schemes http https
// @Param file formData file true "Image data"
// @Success 200 {object} SetAvatarResponse "A url to the stored image"
// @Failure 400 "Bad Request"
// @Failure 500 "Internal Server Error"
// @Security ApiKeyAuth
// @Router /communities/id/{id}/set_avatar [post]
func SetAvatar(communityCase *usecase.Community) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := middlewares.MustGetUser(c)
		communityID := c.Param("id")
		file, err := c.FormFile("file")
		if ginerr.AbortIfErr(c, err, http.StatusBadRequest, "failed to get file") {
			return
		}

		fOpen, err := file.Open()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		defer fOpen.Close()
		fData, err := io.ReadAll(fOpen)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		url, err := communityCase.SetAvatar(usecase.NewContext(c, user), communityID, fData)
		if ginerr.AbortIfErr(c, err, http.StatusInternalServerError, "failed to set avatar") {
			return
		}
		c.JSON(http.StatusOK, SetAvatarResponse{URL: url})
	}
}
