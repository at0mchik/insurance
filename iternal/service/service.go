package service

import "insurance/iternal/repository"

type Service struct {
}

func NewService(repos *repository.Repository) *Service {
	return &Service{}
}
