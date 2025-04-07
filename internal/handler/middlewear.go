package handler

import (
	"errors"
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

	//c.JSON(http.StatusOK, map[string]interface{}{
	//	"id":   userId,
	//	"role": userRole,
	//})
}

func getUserCtx(c *gin.Context) (int, string, error) {
	id, ok := c.Get(userCtxId)
	if !ok {
		return 0, "", errors.New("user id not found")
	}

	idInt, ok := id.(int)
	if !ok {
		return 0, "", errors.New("user id is of invalid type")
	}

	role, ok := c.Get(userCtxRole)
	if !ok {
		return 0, "", errors.New("user role not found")
	}

	roleStr, ok := role.(string)
	if !ok {
		return 0, "", errors.New("user role is of invalid type")
	}

	return idInt, roleStr, nil
}
