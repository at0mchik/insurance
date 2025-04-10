package handler

import (
	"github.com/gin-gonic/gin"
	"insurance/internal/entity"
	"insurance/pkg/response"
	"net/http"
	"strconv"
	//"strconv"
)

func (h *Handler) CreateUser(c *gin.Context) {
	_, role, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if role != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not admin")
		return
	}

	var input entity.User

	if err := c.BindJSON(&input); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	id, err := h.services.User.CreateUser(input)

	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})
}

type getAllUsersResponse struct {
	Data []entity.User `json:"data"`
}

func (h *Handler) GetAllUsers(c *gin.Context) {
	_, role, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if role != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not admin")
		return
	}

	users, err := h.services.User.GetAllUsers()

	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, getAllUsersResponse{
		Data: users,
	})
}

func (h *Handler) GetUserByToken(c *gin.Context) {
	userId, userRole, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if !entity.UserRoles[userRole] {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not client or assessor")
		return
	}

	user, err := h.services.User.GetUserById(userId)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *Handler) GetUserById(c *gin.Context) {
	_, role, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if role != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not admin")
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "invalid id param")
		return
	}

	user, err := h.services.User.GetUserById(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *Handler) DeleteUserById(c *gin.Context) {
	userId, role, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "invalid id param")
		return
	}

	if id != userId && role != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "you cant delete this user")
		return
	}

	if err := h.services.User.DeleteUserById(id); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "user deleted")
}

func (h *Handler) UpdateUserById(c *gin.Context) {
	userId, role, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "invalid id param")
		return
	}

	if id != userId && role != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "you cant update this user")
		return
	}

	var input entity.UpdateUserInput
	if err := c.BindJSON(&input); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.services.UpdateUserById(id, input); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "user updated")
}
