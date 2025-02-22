package ginerr

import (
	"fmt"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func AbortIfErr(c *gin.Context, err error, code int, reason string) bool {
	if err == nil {
		return false
	}
	log.WithError(err).Error("error")
	c.AbortWithStatusJSON(code, gin.H{"error": fmt.Sprintf("%s: %s", reason, err.Error())})
	return true
}
