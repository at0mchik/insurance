package repository

import (
	"github.com/jmoiron/sqlx"
	"insurance/internal/entity"
)

const (
	usersTable             = "users"
	policiesTable          = "policies"
	policyDetailsTable     = "policy_details"
	assessmentRequestTable = "assessment_requests"
	assessmentResultTable  = "assessment_results"
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
	SignIn(username, password string) (entity.User, error)
}

type Policy interface {
	CreatePolicy(policy entity.Policy, details entity.PolicyDetails) (int, error)
	GetAllPolicyByUserId(id int) ([]entity.Policy, []entity.PolicyDetails, error)
	GetAllPolicies() ([]entity.Policy, []entity.PolicyDetails, error)
	GetPolicyById(policyId int) (entity.Policy, entity.PolicyDetails, error)
	UpdatePolicyById(policyId int, input entity.UpdatePolicyInput) error
	DeletePolicyById(policyId int) error
}

type Assessment interface {
	CreateAssessment(assessmentReq entity.AssessmentRequest, assessmentRes entity.AssessmentResultInput) (int, error)
	GetAssessmentById(assessmentId int) (entity.AssessmentRequest, entity.AssessmentResultResponse, error)
	GetAllAssessment() ([]entity.AssessmentRequest, []entity.AssessmentResultResponse, error)
	GetAllAssessmentByUserId(userId int) ([]entity.AssessmentRequest, []entity.AssessmentResultResponse, error)
	AddAssessorToAssessment(assessmentId, assessorId int) error
	UpdateResultById(input entity.AssessmentResultUpdateInput, assessmentId int) error
	DeleteAssessmentById(assessmentId int) error
	GetAllAssessmentByAssessorId(userId int) ([]entity.AssessmentRequest, []entity.AssessmentResultResponse, error)
	GetAllPendingAssessments() ([]entity.AssessmentRequest, []entity.AssessmentResultResponse, error)
}

type Repository struct {
	User
	Authorization
	Policy
	Assessment
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		User:          NewUserPostgres(db),
		Authorization: NewAuthPostgres(db),
		Policy:        NewPolicyPostgres(db),
		Assessment:    NewAssessmentPostgres(db),
	}
}
