package handler

import (
	"github.com/gin-gonic/gin"
	"insurance/internal/entity"
	"insurance/pkg/response"
	"net/http"
)

func (h *Handler) CreateAssessmentRequest(c *gin.Context) {
	userId, userRole, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if userRole != entity.RoleClient && userRole != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not client or admin")
		return
	}

	var input entity.AssessmentRequestInput
	if err := c.BindJSON(&input); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	assessor, err := h.services.User.GetUserById(input.AssessorId)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if assessor.Role != entity.RoleAssessor {
		response.NewErrorResponse(c, http.StatusBadRequest, "user by assessor_id is not assessor")
		return
	}

	id, err := h.services.Assessment.CreateAssessment(userId, input)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})
}
