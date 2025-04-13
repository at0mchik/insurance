package handler

import (
	"github.com/gin-gonic/gin"
	"insurance/internal/entity"
	"insurance/pkg/response"
	"net/http"
	"strconv"
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

	id, err := h.Services.Policy.CreatePolicy(userId, input)

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

func (h *Handler) GetAllPoliciesByUserToken(c *gin.Context) {
	userId, userRole, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if userRole != entity.RoleClient && userRole != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not client")
		return
	}

	policyResponse, err := h.Services.Policy.GetAllPolicyByUserId(userId)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, getAllPolicyResponse{
		Data: policyResponse,
	})
}

func (h *Handler) GetAllPoliciesByUserId(c *gin.Context) {
	_, userRole, err := getUserCtx(c)

	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	if userRole != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not admin")
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "invalid id param")
		return
	}

	policyResponse, err := h.Services.Policy.GetAllPolicyByUserId(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, getAllPolicyResponse{
		Data: policyResponse,
	})
}

func (h *Handler) GetAllPolicies(c *gin.Context) {
	_, userRole, err := getUserCtx(c)

	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	if userRole != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not admin")
		return
	}

	policyResponse, err := h.Services.Policy.GetAllPolicies()

	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, getAllPolicyResponse{
		Data: policyResponse,
	})
}

func (h *Handler) GetPolicyById(c *gin.Context) {
	userId, userRole, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if userRole != entity.RoleClient && userRole != entity.RoleAdmin && userRole != entity.RoleAssessor {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not client or admin")
		return
	}

	policyId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "invalid id param")
		return
	}

	policyResponse, err := h.Services.GetPolicyById(policyId)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	if policyResponse.ClientID != userId && userRole != entity.RoleAdmin && userRole != entity.RoleAssessor {
		response.NewErrorResponse(c, http.StatusUnauthorized, "invalid client id")
		return
	}

	c.JSON(http.StatusOK, policyResponse)
}

func (h *Handler) UpdatePolicyById(c *gin.Context) {
	userId, userRole, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if userRole != entity.RoleClient && userRole != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not client or admin")
		return
	}

	var input entity.UpdatePolicyInput
	if err := c.BindJSON(&input); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	policyId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "invalid id param")
		return
	}

	policy, err := h.Services.GetPolicyById(policyId)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	if policy.ClientID != userId && userRole != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "invalid client id")
		return
	}

	if err := h.Services.UpdatePolicyById(policyId, input); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "policy updated")

}

func (h *Handler) DeletePolicyById(c *gin.Context) {
	userId, userRole, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if userRole != entity.RoleClient && userRole != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not client or admin")
		return
	}

	policyId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "invalid id param")
		return
	}

	policy, err := h.Services.GetPolicyById(policyId)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	if policy.ClientID != userId && userRole != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "invalid client id")
		return
	}

	if err := h.Services.DeletePolicyById(policyId); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "policy deleted")
}
