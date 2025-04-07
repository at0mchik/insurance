package handler

import (
	"github.com/gin-gonic/gin"
	"insurance/internal/entity"
	"insurance/pkg/response"
	"net/http"
)

func (h *Handler) CreatePolicy(c *gin.Context) {
	userId, userRole, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if userRole != entity.RoleClient && userRole != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "tole not client or admin")
		return
	}

	var input entity.PolicyRequest

	if err := c.BindJSON(&input); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	id, err := h.services.Policy.CreatePolicy(userId, input)

	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})
}

type getAllPolicyResponse struct {
	Data []entity.PolicyResponse `json:"data"`
}

func (h *Handler) GetAllPoliciesByUser(c *gin.Context) {
	userId, userRole, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if userRole != entity.RoleClient && userRole != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not client")
		return
	}

	policyResponse, err := h.services.Policy.GetAllPolicyById(userId)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, getAllPolicyResponse{
		Data: policyResponse,
	})
}
