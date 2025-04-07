package service

import (
	"github.com/sirupsen/logrus"
	"insurance/internal/entity"
	"insurance/internal/repository"
	"insurance/pkg/auth"
)

type AuthService struct {
	repo repository.Authorization
}

func NewAuthService(repo repository.Authorization) *AuthService {
	return &AuthService{repo: repo}
}

func (s *AuthService) SignUp(user entity.User) (int, error) {
	logrus.Info("auth service in")

	user.Role = entity.RoleClient
	//fmt.Printf("user role: %s", user.Role)

	user.Password = auth.GeneratePasswordHash(user.Password)

	logrus.Info("auth service out")
	return s.repo.SignUp(user)
}

func (s *AuthService) SignIn(username, password string) (string, error) {
	user, err := s.repo.SignIn(username, auth.GeneratePasswordHash(password))
	if err != nil {
		return "", err
	}

	token, err := auth.GenerateToken(user.Role, user.Id)
	if err != nil {
		return "", err
	}

	return token, nil
}
