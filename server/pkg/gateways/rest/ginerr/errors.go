package ginerr

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/utils/slogx"
)

func AbortIfErr(c *gin.Context, err error, code int, reason string) bool {
	if err == nil {
		return false
	}
	err = fmt.Errorf("%s: %w", reason, err)
	slogx.FromCtxWithErr(c, err).Error("Aborting handler")
	c.AbortWithStatusJSON(code, gin.H{"error": err.Error()})
	return true
}
