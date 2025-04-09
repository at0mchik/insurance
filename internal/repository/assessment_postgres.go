package repository

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"insurance/internal/entity"
)

type AssessmentPostgres struct {
	db *sqlx.DB
}

func NewAssessmentPostgres(db *sqlx.DB) *AssessmentPostgres {
	return &AssessmentPostgres{db: db}
}

func (r *AssessmentPostgres) CreateAssessment(request entity.AssessmentRequest, result entity.AssessmentResultInput) (int, error) {
	tx, err := r.db.Begin()
	if err != nil {
		return 0, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		} else {
			_ = tx.Commit()
		}
	}()

	var assessmentId int
	query := fmt.Sprintf(`INSERT INTO %s (client_id, policy_id, assessor_id, request_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING id`, assessmentRequestTable)

	err = tx.QueryRow(query, request.ClientId, request.PolicyId, request.AssessorId, request.RequestDate,
		request.Status).Scan(&assessmentId)
	if err != nil {
		return 0, fmt.Errorf("failed to insert assessment request: %w", err)
	}

	resultQuery := fmt.Sprintf(`INSERT INTO %s (request_id, assessor_id, result_text) VALUES($1, $2, $3)`, assessmentResultTable)
	_, err = tx.Exec(resultQuery, assessmentId, result.AssessorId, result.ResultText)
	if err != nil {
		return 0, fmt.Errorf("failed to insert policy details: %w", err)
	}

	return assessmentId, nil
}
