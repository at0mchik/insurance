package response

import (
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type responseError struct {
	Message string `json:"message"`
}

func NewErrorResponse(c *gin.Context, statusCode int, message string) {
	logrus.Errorf(message)
	c.AbortWithStatusJSON(statusCode, responseError{message})
}
