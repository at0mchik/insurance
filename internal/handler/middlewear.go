package handler

import (
	"encoding/json"
	"errors"
	"github.com/gin-gonic/gin"
	"insurance/pkg/auth"
	"insurance/pkg/response"
	"log"
	"net/http"
	"strings"
)

const (
	authorizationHeader = "Authorization"
	userCtxId           = "userId"
	userCtxRole         = "userRole"
)

//func CORSMiddleware() gin.HandlerFunc {
//	return func(c *gin.Context) {
//		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
//		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
//		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
//		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
//
//		if c.Request.Method == "OPTIONS" {
//			c.AbortWithStatus(204)
//			return
//		}
//
//		c.Next()
//	}
//}

type ClassReturn struct {
	Errcode int         `json:"errcode"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func corsHandler(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print("preflight detected: ", r.Header)
		w.Header().Add("Connection", "keep-alive")
		w.Header().Add("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Add("Access-Control-Allow-Methods", "POST, OPTIONS, GET, DELETE, PUT")
		w.Header().Add("Access-Control-Allow-Headers", "content-type")
		w.Header().Add("Access-Control-Max-Age", "86400")

		// continue with my method
		handleOutput(w, r)
	}
}

func handleOutput(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(ClassReturn{
		Errcode: 0,
		Message: "stuff endpoint",
		Data:    r.Method,
	})
}

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
