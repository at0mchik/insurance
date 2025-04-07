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
	GetAllPolicyById(id int) ([]entity.PolicyResponse, error)
	//GetAllPolicies() ([]entity.Policy, error)
	//GetPolicyById(id int) (entity.Policy, error)
	//DeletePolicyById(id int) error
	//UpdatePolicyById(id int, input *entity.UpdatePolicyInput) error
}

type Service struct {
	User
	Authorization
	Policy
}

func NewService(repos *repository.Repository) *Service {
	return &Service{
		User:          NewUserService(repos),
		Authorization: NewAuthService(repos),
		Policy:        NewPolicyService(repos),
	}
}
