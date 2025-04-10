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
		return 0, fmt.Errorf("invalid request_date: %w", err)
	}

	assessmentReq := entity.AssessmentRequest{
		ClientId:    userId,
		PolicyId:    input.PolicyId,
		RequestDate: reqDate,
		Status:      entity.StatusPending,
	}

	assessmentRes := entity.AssessmentResultInput{
		ResultText: entity.EmptyResult,
	}

	return s.repo.CreateAssessment(assessmentReq, assessmentRes)
}

func (s *AssessmentService) GetAssessmentById(assessmentId int) (entity.AssessmentRequestResponse, error) {
	request, result, err := s.repo.GetAssessmentById(assessmentId)
	if err != nil {
		return entity.AssessmentRequestResponse{}, err
	}

	return entity.AssessmentRequestResponse{
		Id:          request.Id,
		ClientId:    request.ClientId,
		PolicyId:    request.PolicyId,
		AssessorId:  request.AssessorId,
		RequestDate: request.RequestDate.Format("2006-01-02"),
		Status:      request.Status,
		Result:      result,
	}, nil
}

func (s *AssessmentService) GetAllAssessment() ([]entity.AssessmentRequestResponse, error) {
	requests, results, err := s.repo.GetAllAssessment()
	if err != nil {
		return []entity.AssessmentRequestResponse{}, err
	}

	var assessmentResponse []entity.AssessmentRequestResponse
	for i, request := range requests {
		assessmentResponse = append(assessmentResponse,
			entity.AssessmentRequestResponse{
				Id:          request.Id,
				ClientId:    request.ClientId,
				PolicyId:    request.PolicyId,
				AssessorId:  request.AssessorId,
				RequestDate: request.RequestDate.Format("2006-01-02"),
				Status:      request.Status,
				Result:      results[i],
			})
	}

	return assessmentResponse, nil
}

func (s *AssessmentService) GetAllAssessmentByUserId(userId int) ([]entity.AssessmentRequestResponse, error) {
	requests, results, err := s.repo.GetAllAssessmentByUserId(userId)
	if err != nil {
		return []entity.AssessmentRequestResponse{}, err
	}

	var assessmentResponse []entity.AssessmentRequestResponse
	for i, request := range requests {
		assessmentResponse = append(assessmentResponse,
			entity.AssessmentRequestResponse{
				Id:          request.Id,
				ClientId:    request.ClientId,
				PolicyId:    request.PolicyId,
				AssessorId:  request.AssessorId,
				RequestDate: request.RequestDate.Format("2006-01-02"),
				Status:      request.Status,
				Result:      results[i],
			})
	}

	return assessmentResponse, nil
}

func (s *AssessmentService) AddAssessorToAssessment(input entity.AssessorAssignInput) error {
	return s.repo.AddAssessorToAssessment(input.AssessmentId, input.AssessorId)
}

func (s *AssessmentService) UpdateResultById(input entity.AssessmentResultUpdateInput, assessmentId int) error {
	if err := input.Validate(); err != nil {
		return err
	}

	return s.repo.UpdateResultById(input, assessmentId)
}

func (s *AssessmentService) DeleteAssessmentById(assessmentId int) error {
	return s.repo.DeleteAssessmentById(assessmentId)
}
