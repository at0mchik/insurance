package service

import (
	"encoding/json"
	"fmt"
	"insurance/internal/entity"
	"insurance/internal/repository"
	"time"
)

type PolicyService struct {
	repo repository.Policy
}

func NewPolicyService(repo repository.Policy) *PolicyService {
	return &PolicyService{repo: repo}
}

func (s *PolicyService) CreatePolicy(userId int, policyReq entity.PolicyRequest) (int, error) {

	if !entity.TypePolicy[policyReq.Type] {
		return 0, fmt.Errorf("unsupported policy type: %s", policyReq.Type)
	}

	startDate, err := time.Parse("2006-01-02", policyReq.StartDate)
	if err != nil {
		return 0, fmt.Errorf("invalid start_date: %w", err)
	}
	endDate, err := time.Parse("2006-01-02", policyReq.EndDate)
	if err != nil {
		return 0, fmt.Errorf("invalid end_date: %w", err)
	}

	policy := entity.Policy{
		ClientId:   userId,
		PolicyType: policyReq.Type,
		StartDate:  startDate,
		EndDate:    endDate,
		Premium:    policyReq.Premium,
	}

	var validatedDetails any

	switch policyReq.Type {
	case "car":
		var details entity.CarDetails
		if err := json.Unmarshal(policyReq.Details, &details); err != nil {
			return 0, fmt.Errorf("invalid car details: %w", err)
		}
		validatedDetails = details

	case "apartment":
		var details entity.ApartmentDetails
		if err := json.Unmarshal(policyReq.Details, &details); err != nil {
			return 0, fmt.Errorf("invalid apartment details: %w", err)
		}
		validatedDetails = details

	case "health":
		var details entity.HealthDetails
		if err := json.Unmarshal(policyReq.Details, &details); err != nil {
			return 0, fmt.Errorf("invalid health details: %w", err)
		}
		validatedDetails = details

	case "crypto_wallet":
		var details entity.WalletDetails
		if err := json.Unmarshal(policyReq.Details, &details); err != nil {
			return 0, fmt.Errorf("invalid wallet details: %w", err)
		}
		validatedDetails = details
	}

	detailsJSON, err := json.Marshal(validatedDetails)
	if err != nil {
		return 0, fmt.Errorf("failed to marshal details: %w", err)
	}

	policyDetails := entity.PolicyDetails{
		Details: detailsJSON,
	}

	policyID, err := s.repo.CreatePolicy(policy, policyDetails)
	if err != nil {
		return 0, fmt.Errorf("failed to save policy: %w", err)
	}

	return policyID, nil
}

func (s *PolicyService) GetAllPolicyById(id int) ([]entity.PolicyResponse, error) {
	policies, details, err := s.repo.GetAllPolicyById(id)
	if err != nil {
		return []entity.PolicyResponse{}, err
	}

	var policiesResponse []entity.PolicyResponse
	for i, policy := range policies {
		policiesResponse = append(policiesResponse,
			entity.PolicyResponse{
				ID:        policy.Id,
				ClientID:  policy.ClientId,
				Type:      policy.PolicyType,
				StartDate: policy.StartDate.Format("2006-01-02"),
				EndDate:   policy.EndDate.Format("2006-01-02"),
				Premium:   policy.Premium,
				Details:   details[i].Details,
			})
	}

	return policiesResponse, nil
}

//func (s *PolicyService) GetAllPolicies() ([]entity.Policy, error) {
//
//}
//
//func (s *PolicyService) GetPolicyById(id int) (entity.Policy, error) {
//
//}
//
//func (s *PolicyService) DeletePolicyById(id int) error {
//
//}
//
//func (s *PolicyService) UpdatePolicyById(id int, input *entity.UpdatePolicyInput) error {
//
//}
