package middlewares

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/shampsdev/tglinked/server/pkg/domain"
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authToken := c.GetHeader("X-API-Token")
		fmt.Println(authToken)
		c.Set("user", &domain.User{ID: authToken})

		c.Next()
	}
}

func MustGetUser(c *gin.Context) *domain.User {
	user, ok := c.MustGet("user").(*domain.User)
	if !ok {
		panic("user not found")
	}
	return user
}
