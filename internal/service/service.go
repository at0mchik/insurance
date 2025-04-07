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

type Service struct {
	User
}

func NewService(repos *repository.Repository) *Service {
	return &Service{}
}
