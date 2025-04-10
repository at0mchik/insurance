package handler

import (
	"github.com/gin-gonic/gin"
	"insurance/internal/entity"
	"insurance/pkg/response"
	"net/http"
	"strconv"
)

func (h *Handler) CreateAssessmentRequestByToken(c *gin.Context) {
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

	id, err := h.services.Assessment.CreateAssessment(userId, input)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})
}

func (h *Handler) GetAssessmentById(c *gin.Context) {
	userId, userRole, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if !entity.UserRoles[userRole] {
		response.NewErrorResponse(c, http.StatusUnauthorized, "invalid role")
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "invalid id param")
		return
	}

	assessmentResponse, err := h.services.Assessment.GetAssessmentById(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if userRole == entity.RoleClient && userId != assessmentResponse.ClientId {
		response.NewErrorResponse(c, http.StatusUnauthorized, "invalid client id")
		return
	}

	c.JSON(http.StatusOK, assessmentResponse)
}

type getAllAssessmentResponse struct {
	Data []entity.AssessmentRequestResponse `json:"data"`
}

func (h *Handler) GetAllAssessments(c *gin.Context) {
	_, userRole, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if userRole != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not client or admin")
		return
	}

	assessmentResponse, err := h.services.Assessment.GetAllAssessment()
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, getAllAssessmentResponse{
		Data: assessmentResponse,
	})
}

func (h *Handler) GetAllAssessmentsByUserToken(c *gin.Context) {
	userId, userRole, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if userRole != entity.RoleClient {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not client or admin")
		return
	}

	assessmentResponse, err := h.services.Assessment.GetAllAssessmentByUserId(userId)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, getAllAssessmentResponse{
		Data: assessmentResponse,
	})
}

func (h *Handler) GetAllAssessmentsByUserId(c *gin.Context) {
	_, userRole, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if userRole != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not client or admin")
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "invalid id param")
		return
	}

	assessmentResponse, err := h.services.Assessment.GetAllAssessmentByUserId(id)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, getAllAssessmentResponse{
		Data: assessmentResponse,
	})
}

func (h *Handler) AssignAssessorToAssessment(c *gin.Context) {
	userId, userRole, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if userRole != entity.RoleAdmin && userRole != entity.RoleAssessor {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not assessor or admin")
		return
	}

	var input entity.AssessorAssignInput
	if err := c.BindJSON(&input); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if userRole == entity.RoleAssessor {
		input.AssessorId = userId
	}

	err = h.services.Assessment.AddAssessorToAssessment(input)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "assessor added")
}

func (h *Handler) ChangeResultAssessment(c *gin.Context) {
	userId, userRole, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if userRole != entity.RoleAdmin && userRole != entity.RoleAssessor && userRole != entity.RoleClient {
		response.NewErrorResponse(c, http.StatusUnauthorized, "no role")
		return
	}

	var input entity.AssessmentResultUpdateInput
	if err := c.BindJSON(&input); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	assessmentId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "invalid id param")
		return
	}

	assessment, err := h.services.Assessment.GetAssessmentById(assessmentId)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if userRole == entity.RoleAssessor && assessment.AssessorId != userId {
		response.NewErrorResponse(c, http.StatusUnauthorized, "cant edit this")
		return
	}
	if userRole == entity.RoleClient && assessment.ClientId != userId && *input.Status != entity.StatusCancelled {
		response.NewErrorResponse(c, http.StatusUnauthorized, "cant edit this")
		return
	}

	err = h.services.Assessment.UpdateResultById(input, assessmentId)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "result changed")
}

func (h *Handler) DeleteAssessmentById(c *gin.Context) {
	_, userRole, err := getUserCtx(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	if userRole != entity.RoleAdmin {
		response.NewErrorResponse(c, http.StatusUnauthorized, "role not admin")
		return
	}

	assessmentId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "invalid id param")
		return
	}

	err = h.services.Assessment.DeleteAssessmentById(assessmentId)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "assessment deleted")
}
