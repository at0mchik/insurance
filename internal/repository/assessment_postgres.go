package repository

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"insurance/internal/entity"
	"time"
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
	query := fmt.Sprintf(`INSERT INTO %s (client_id, policy_id, request_date, status) VALUES ($1, $2, $3, $4) RETURNING id`, assessmentRequestTable)

	err = tx.QueryRow(query, request.ClientId, request.PolicyId, request.RequestDate,
		request.Status).Scan(&assessmentId)
	if err != nil {
		return 0, fmt.Errorf("failed to insert assessment request: %w", err)
	}

	resultQuery := fmt.Sprintf(`INSERT INTO %s (request_id, result_text) VALUES($1, $2)`, assessmentResultTable)
	_, err = tx.Exec(resultQuery, assessmentId, result.ResultText)
	if err != nil {
		return 0, fmt.Errorf("failed to insert policy details: %w", err)
	}

	return assessmentId, nil
}

func (r *AssessmentPostgres) GetAssessmentById(assessmentId int) (entity.AssessmentRequest, entity.AssessmentResultResponse, error) {
	var request entity.AssessmentRequest
	var result entity.AssessmentResultResponse

	var tempString string
	queryTemp := fmt.Sprintf(`SELECT result_text FROM %s WHERE request_id = $1`, assessmentResultTable)
	err := r.db.Get(&tempString, queryTemp, assessmentId)
	if err != nil {
		return entity.AssessmentRequest{}, entity.AssessmentResultResponse{}, err
	}

	var query string

	if tempString == entity.EmptyResult {
		query = fmt.Sprintf(`SELECT id, client_id, policy_id, request_date, status FROM %s WHERE id = $1`, assessmentRequestTable)
	} else if tempString == entity.AssessorAssignedNoResult {
		query = fmt.Sprintf(`SELECT id, client_id, policy_id, assessor_id, request_date, status FROM %s WHERE id = $1`, assessmentRequestTable)
	} else {
		query = fmt.Sprintf(`SELECT id, client_id, policy_id, assessor_id, request_date, status FROM %s WHERE id = $1`, assessmentRequestTable)
		queryDetails := fmt.Sprintf(`SELECT result_text, value, result_date FROM %s WHERE request_id = $1`, assessmentResultTable)

		err = r.db.Get(&result, queryDetails, assessmentId)
		if err != nil {
			return entity.AssessmentRequest{}, entity.AssessmentResultResponse{}, err
		}
	}

	if request.Status == entity.StatusCancelled {
		queryDetails := fmt.Sprintf(`SELECT result_text, result_date FROM %s WHERE request_id = $1`, assessmentResultTable)

		err = r.db.Get(&result, queryDetails, assessmentId)
		if err != nil {
			return entity.AssessmentRequest{}, entity.AssessmentResultResponse{}, err
		}
	} else {
		result = entity.AssessmentResultResponse{
			ResultText: tempString,
		}
	}

	err = r.db.Get(&request, query, assessmentId)
	if err != nil {
		return entity.AssessmentRequest{}, entity.AssessmentResultResponse{}, err
	}

	return request, result, nil
}

func (r *AssessmentPostgres) GetAllAssessment() ([]entity.AssessmentRequest, []entity.AssessmentResultResponse, error) {
	var requests []entity.AssessmentRequest
	var results []entity.AssessmentResultResponse
	var assessmentsId []int

	queryId := fmt.Sprintf(`SELECT id FROM %s`, assessmentRequestTable)
	err := r.db.Select(&assessmentsId, queryId)

	if err != nil {
		return []entity.AssessmentRequest{}, []entity.AssessmentResultResponse{}, fmt.Errorf("error while selecting all id: %w", err)
	}

	for _, id := range assessmentsId {
		request, result, err := r.GetAssessmentById(id)
		if err != nil {
			return []entity.AssessmentRequest{}, []entity.AssessmentResultResponse{}, fmt.Errorf("error while selecting assessment with id %d: %w", err, id)
		}
		requests = append(requests, request)
		results = append(results, result)
	}

	return requests, results, nil
}

func (r *AssessmentPostgres) GetAllAssessmentByUserId(userId int) ([]entity.AssessmentRequest, []entity.AssessmentResultResponse, error) {
	var requests []entity.AssessmentRequest
	var results []entity.AssessmentResultResponse
	var assessmentsId []int

	queryId := fmt.Sprintf(`SELECT id FROM %s WHERE client_id = $1`, assessmentRequestTable)
	err := r.db.Select(&assessmentsId, queryId, userId)

	if err != nil {
		return []entity.AssessmentRequest{}, []entity.AssessmentResultResponse{}, fmt.Errorf("error while selecting all id: %w", err)
	}

	for _, id := range assessmentsId {
		request, result, err := r.GetAssessmentById(id)
		if err != nil {
			return []entity.AssessmentRequest{}, []entity.AssessmentResultResponse{}, fmt.Errorf("error while selecting assessment with id %d: %w", err, id)
		}
		requests = append(requests, request)
		results = append(results, result)
	}

	return requests, results, nil
}

func (r *AssessmentPostgres) AddAssessorToAssessment(assessmentId, assessorId int) error {
	query := fmt.Sprintf("UPDATE %s SET assessor_id=$1 WHERE id=$2", assessmentRequestTable)

	_, err := r.db.Exec(query, assessorId, assessmentId)

	if err != nil {
		return err
	}

	queryResult := fmt.Sprintf("UPDATE %s SET assessor_id=$1, result_text=$2 WHERE request_id=$3", assessmentResultTable)
	_, err = r.db.Exec(queryResult, assessorId, entity.AssessorAssignedNoResult, assessmentId)

	return err
}

func (r *AssessmentPostgres) UpdateResultById(input entity.AssessmentResultUpdateInput, assessmentId int) error {
	tx, err := r.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		} else {
			_ = tx.Commit()
		}
	}()

	resDate, err := time.Parse("2006-01-02", *input.ResultDate)
	if err != nil {
		fmt.Errorf("invalid request_date: %w", err)
	}

	query := fmt.Sprintf("UPDATE %s SET status=$1 WHERE id=$2", assessmentRequestTable)
	_, err = r.db.Exec(query, input.Status, assessmentId)
	if err != nil {
		return err
	}

	if *input.Status == entity.StatusCancelled {
		queryResult := fmt.Sprintf(`UPDATE %s SET result_date=$1 WHERE request_id=$2`, assessmentResultTable)
		_, err = r.db.Exec(queryResult, resDate, assessmentId)
	} else {
		queryResult := fmt.Sprintf(`UPDATE %s SET result_text=$1, value=$2, result_date=$3 WHERE request_id=$4`, assessmentResultTable)
		_, err = r.db.Exec(queryResult, input.ResultText, input.Value, resDate, assessmentId)
	}

	return err
}

func (r *AssessmentPostgres) DeleteAssessmentById(assessmentId int) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", assessmentRequestTable)

	_, err := r.db.Exec(query, assessmentId)

	return err
}
