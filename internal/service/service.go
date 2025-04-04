package service

import "insurance/internal/repository"

type Service struct {
}

func NewService(repos *repository.Repository) *Service {
	return &Service{}
}
