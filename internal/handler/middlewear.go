package handler

import (
	"github.com/gin-gonic/gin"
	"insurance/pkg/auth"
	"insurance/pkg/response"
	"net/http"
	"strings"
)

const (
	authorizationHeader = "Authorization"
	userCtxId           = "userId"
	userCtxRole         = "userRole"
)

func (h *Handler) UserIdentity(c *gin.Context) {
	header := c.GetHeader(authorizationHeader)
	if header == "" {
		response.NewErrorResponse(c, http.StatusUnauthorized, "empty auth header")
		return
	}

	headerParts := strings.Split(header, " ")
	if len(headerParts) != 2 {
		response.NewErrorResponse(c, http.StatusUnauthorized, "invalid auth header")
	}

	userId, userRole, err := auth.ParseToken(headerParts[1])
	if err != nil {
		response.NewErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	c.Set(userCtxId, userId)
	c.Set(userCtxRole, userRole)

	c.JSON(http.StatusOK, map[string]interface{}{
		"id":   userId,
		"role": userRole,
	})
}
