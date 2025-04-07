package repository

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"insurance/internal/entity"
	"strings"
)

type UserPostgres struct {
	db *sqlx.DB
}

func NewUserPostgres(db *sqlx.DB) *UserPostgres {
	return &UserPostgres{db: db}
}

func (r *UserPostgres) CreateUser(user entity.User) (int, error) {
	var id int
	query := fmt.Sprintf("INSERT INTO %s (name, username, password_hash, role, gender, phone, email, passport_number, age, info) "+
		"values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id", usersTable)
	row := r.db.QueryRow(query, user.Name, user.Username, user.Password, user.Role, user.Gender, user.Phone,
		user.Email, user.PassportNumber, user.Age, user.Info)
	if err := row.Scan(&id); err != nil {
		return 0, err
	}

	return id, nil
}

func (r *UserPostgres) GetAllUsers() ([]entity.User, error) {
	var users []entity.User

	query := fmt.Sprintf("SELECT * FROM %s", usersTable)
	err := r.db.Select(&users, query)

	return users, err
}

func (r *UserPostgres) GetUserById(id int) (entity.User, error) {
	var user entity.User
	query := fmt.Sprintf("SELECT * FROM %s WHERE id=$1", usersTable)

	err := r.db.Get(&user, query, id)

	return user, err
}

func (r *UserPostgres) DeleteUserById(id int) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", usersTable)

	_, err := r.db.Exec(query, id)

	return err
}

func (r *UserPostgres) UpdateUserById(id int, input entity.UpdateUserInput) error {
	setValues := make([]string, 0)
	args := make([]interface{}, 0)
	argId := 1

	if input.Name != nil {
		setValues = append(setValues, fmt.Sprintf("name=$%d", argId))
		args = append(args, *input.Name)
		argId++
	}
	if input.Password != nil {
		setValues = append(setValues, fmt.Sprintf("password_hash=$%d", argId))
		args = append(args, *input.Password)
		argId++
	}
	if input.Gender != nil {
		setValues = append(setValues, fmt.Sprintf("gender=$%d", argId))
		args = append(args, *input.Gender)
		argId++
	}
	if input.Phone != nil {
		setValues = append(setValues, fmt.Sprintf("phone=$%d", argId))
		args = append(args, *input.Phone)
		argId++
	}
	if input.PassportNumber != nil {
		setValues = append(setValues, fmt.Sprintf("passport_number=$%d", argId))
		args = append(args, *input.PassportNumber)
		argId++
	}
	if input.Age != nil {
		setValues = append(setValues, fmt.Sprintf("age=$%d", argId))
		args = append(args, *input.Age)
		argId++
	}
	if input.Info != nil {
		setValues = append(setValues, fmt.Sprintf("info=$%d", argId))
		args = append(args, *input.Info)
		argId++
	}

	setQuery := strings.Join(setValues, ", ")

	query := fmt.Sprintf("UPDATE %s SET %s WHERE id=$%d", usersTable, setQuery, argId)
	args = append(args, id)

	_, err := r.db.Exec(query, args...)

	return err
}
