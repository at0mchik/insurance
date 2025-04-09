package service

import (
	"fmt"
	"insurance/internal/entity"
	"insurance/internal/repository"
	"time"
)

type AssessmentService struct {
	repo repository.Assessment
}

func NewAssessmentService(repo repository.Assessment) *AssessmentService {
	return &AssessmentService{repo: repo}
}

func (s *AssessmentService) CreateAssessment(userId int, input entity.AssessmentRequestInput) (int, error) {
	reqDate, err := time.Parse("2006-01-02", input.RequestDate)
	if err != nil {
		return 0, fmt.Errorf("invalid start_date: %w", err)
	}

	assessmentReq := entity.AssessmentRequest{
		ClientId:    userId,
		AssessorId:  input.AssessorId,
		PolicyId:    input.PolicyId,
		RequestDate: reqDate,
		Status:      entity.StatusPending,
	}

	assessmentRes := entity.AssessmentResultInput{
		AssessorId: input.AssessorId,
		ResultText: "empty",
	}

	return s.repo.CreateAssessment(assessmentReq, assessmentRes)
}
