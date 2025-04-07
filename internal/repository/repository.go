package repository

import (
	"github.com/jmoiron/sqlx"
	"insurance/internal/entity"
)

const (
	usersTable = "users"
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

type Repository struct {
	User
	Authorization
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		User:          NewUserPostgres(db),
		Authorization: NewAuthPostgres(db),
	}
}
