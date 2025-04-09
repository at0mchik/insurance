package service

import (
	"insurance/internal/entity"
	"insurance/internal/repository"
)

type User interface {
	CreateUser(user entity.User) (int, error)
	GetAllUsers() ([]entity.User, error)
	GetUserById(id int) (entity.User, error)
	DeleteUserById(id int) error
	UpdateUserById(id int, input entity.UpdateUserInput) error
}

type Authorization interface {
	SignUp(user entity.User) (int, error)
	SignIn(username, password string) (string, error)
}

type Policy interface {
	CreatePolicy(userId int, policyReq entity.PolicyRequest) (int, error)
	GetAllPolicyByUserId(id int) ([]entity.PolicyResponse, error)
	GetAllPolicies() ([]entity.PolicyResponse, error)
	UpdatePolicyById(policyId int, input entity.UpdatePolicyInput) error
	GetPolicyById(policyId int) (entity.PolicyResponse, error)
	DeletePolicyById(policyId int) error
}

type Assessment interface {
	CreateAssessment(userId int, input entity.AssessmentRequestInput) (int, error)
	GetAssessmentById(assessmentId int) (entity.AssessmentRequestResponse, error)
	GetAllAssessment() ([]entity.AssessmentRequestResponse, error)
	GetAllAssessmentByUserId(userId int) ([]entity.AssessmentRequestResponse, error)
	AddAssessorToAssessment(input entity.AssessorAssignInput) error
	UpdateResultById(input entity.AssessmentResultUpdateInput, assessmentId int) error
	DeleteAssessmentById(assessmentId int) error
}

type Service struct {
	User
	Authorization
	Policy
	Assessment
}

func NewService(repos *repository.Repository) *Service {
	return &Service{
		User:          NewUserService(repos),
		Authorization: NewAuthService(repos),
		Policy:        NewPolicyService(repos),
		Assessment:    NewAssessmentService(repos),
	}
}
