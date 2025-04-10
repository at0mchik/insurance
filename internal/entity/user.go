package entity

import "errors"

type User struct {
	Id             int    `json:"id" db:"id"`
	Name           string `json:"name" binding:"required" db:"name"`
	Username       string `json:"username" binding:"required" db:"username"`
	Password       string `json:"password" binding:"required" db:"password_hash"`
	Role           string `json:"role" binding:"required" db:"role"`
	Gender         string `json:"gender" binding:"required" db:"gender"`
	Phone          string `json:"phone" binding:"required" db:"phone"`
	Email          string `json:"email" binding:"required" db:"email"`
	PassportNumber string `json:"passport_number" binding:"required" db:"passport_number"`
	Age            int    `json:"age" binding:"required" db:"age"`
	Info           string `json:"info" binding:"required" db:"info"`
}

type UpdateUserInput struct {
	Name           *string `json:"name"`
	Password       *string `json:"password"`
	Gender         *string `json:"gender"`
	Phone          *string `json:"phone"`
	PassportNumber *string `json:"passport_number"`
	Age            *int    `json:"age"`
	Info           *string `json:"info"`
}

func (i UpdateUserInput) Validate() error {
	if i.Name == nil && i.Password == nil {
		errors.New("empty update input")
	}
	return nil
}

var UserRoles map[string]bool

const (
	RoleAdmin    = "admin"
	RoleClient   = "client"
	RoleManager  = "manager"
	RoleAssessor = "assessor"
)

func init() {
	UserRoles = map[string]bool{RoleClient: true, RoleAdmin: true, RoleAssessor: true}
}
