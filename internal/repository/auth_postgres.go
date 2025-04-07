package repository

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"insurance/internal/entity"
)

type AuthPostgres struct {
	db *sqlx.DB
}

func NewAuthPostgres(db *sqlx.DB) *AuthPostgres {
	return &AuthPostgres{db: db}
}

func (r *AuthPostgres) SignUp(user entity.User) (int, error) {
	fmt.Println("auth repo in")

	var id int
	query := fmt.Sprintf("INSERT INTO %s (name, username, password_hash, role, gender, phone, email, passport_number, age, info) "+
		"values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id", usersTable)
	row := r.db.QueryRow(query, user.Name, user.Username, user.Password, user.Role, user.Gender, user.Phone,
		user.Email, user.PassportNumber, user.Age, user.Info)
	if err := row.Scan(&id); err != nil {
		return 0, err
	}

	fmt.Println("auth repo out")
	return id, nil
}

func (r *AuthPostgres) SignIn(username, password string) (entity.User, error) {
	var user entity.User
	query := fmt.Sprintf("SELECT * FROM %s WHERE username=$1 AND password_hash=$2", usersTable)

	err := r.db.Get(&user, query, username, password)

	return user, err
}
