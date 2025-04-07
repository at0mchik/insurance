package service

import (
	"errors"
	"insurance/internal/entity"
	"insurance/internal/repository"
	"insurance/pkg/auth"
)

type UserService struct {
	repo repository.User
}

func NewUserService(repo repository.User) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) CreateUser(user entity.User) (int, error) {
	validRole := false
	for _, role := range entity.UserRoles {
		if role == user.Role {
			validRole = true
			break
		}
	}
	if !validRole {
		return 0, errors.New("invalid role")
	}

	user.Password = auth.GeneratePasswordHash(user.Password)

	return s.repo.CreateUser(user)
}

func (s *UserService) GetAllUsers() ([]entity.User, error) {
	return s.repo.GetAllUsers()
}

func (s *UserService) GetUserById(id int) (entity.User, error) {
	return s.repo.GetUserById(id)
}
func (s *UserService) DeleteUserById(id int) error {
	return s.repo.DeleteUserById(id)
}
func (s *UserService) UpdateUserById(id int, input entity.UpdateUserInput) error {
	if err := input.Validate(); err != nil {
		return err
	}

	if input.Password != nil {
		*input.Password = auth.GeneratePasswordHash(*input.Password)
	}

	return s.repo.UpdateUserById(id, input)
}
