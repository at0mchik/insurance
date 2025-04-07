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

type Service struct {
	User
	Authorization
}

func NewService(repos *repository.Repository) *Service {
	return &Service{
		User:          NewUserService(repos),
		Authorization: NewAuthService(repos),
	}
}
