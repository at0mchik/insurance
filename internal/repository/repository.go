package repository

import (
	"github.com/jmoiron/sqlx"
	"insurance/internal/entity"
)

const (
	usersTable    = "users"
	policiesTable = "policies"
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

type Repository struct {
	User
	Authorization
	Policy
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		User:          NewUserPostgres(db),
		Authorization: NewAuthPostgres(db),
		Policy:        NewPolicyPostgres(db),
	}
}
