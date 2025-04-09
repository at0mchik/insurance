package repository

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"insurance/internal/entity"
	"strings"
)

type PolicyPostgres struct {
	db *sqlx.DB
}

func NewPolicyPostgres(db *sqlx.DB) *PolicyPostgres {
	return &PolicyPostgres{db: db}
}

func (r *PolicyPostgres) CreatePolicy(policy entity.Policy, details entity.PolicyDetails) (int, error) {
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

	var policyID int
	query := fmt.Sprintf(`INSERT INTO %s (client_id, policy_type, start_date, end_date, premium) VALUES ($1, $2, $3, $4, $5) RETURNING id`, policiesTable)

	err = tx.QueryRow(query, policy.ClientId, policy.PolicyType, policy.StartDate, policy.EndDate, policy.Premium).Scan(&policyID)
	if err != nil {
		return 0, fmt.Errorf("failed to insert policy: %w", err)
	}

	detailQuery := fmt.Sprintf(`INSERT INTO %s (policy_id, details)	VALUES ($1, $2)	`, policyDetailsTable)
	_, err = tx.Exec(detailQuery, policyID, details.Details)
	if err != nil {
		return 0, fmt.Errorf("failed to insert policy details: %w", err)
	}

	return policyID, nil
}

func (r *PolicyPostgres) GetAllPolicyByUserId(id int) ([]entity.Policy, []entity.PolicyDetails, error) {
	var policies []entity.Policy
	query := fmt.Sprintf(`SELECT id, client_id, policy_type, start_date, end_date, premium FROM %s WHERE client_id = $1`, policiesTable)

	err := r.db.Select(&policies, query, id)

	if err != nil {
		return []entity.Policy{}, []entity.PolicyDetails{}, fmt.Errorf("policy not found: %w", err)
	}

	var details []entity.PolicyDetails

	for _, policy := range policies {
		var temp entity.PolicyDetails
		detailQuery := fmt.Sprintf(`SELECT policy_id, details FROM %s WHERE policy_id = $1`, policyDetailsTable)

		err = r.db.Get(&temp, detailQuery, policy.Id)

		if err != nil {
			return policies, []entity.PolicyDetails{}, fmt.Errorf("policy details not found: %w", err)
		}
		details = append(details, temp)
	}

	return policies, details, nil
}

func (r *PolicyPostgres) GetAllPolicies() ([]entity.Policy, []entity.PolicyDetails, error) {
	var policies []entity.Policy
	query := fmt.Sprintf(`SELECT id, client_id, policy_type, start_date, end_date, premium FROM %s`, policiesTable)

	err := r.db.Select(&policies, query)

	if err != nil {
		return []entity.Policy{}, []entity.PolicyDetails{}, fmt.Errorf("error while selecting all policies: %w", err)
	}

	var policiesDetils []entity.PolicyDetails
	queryDetails := fmt.Sprintf(`SELECT policy_id, details FROM %s`, policyDetailsTable)

	err = r.db.Select(&policiesDetils, queryDetails)

	if err != nil {
		return []entity.Policy{}, []entity.PolicyDetails{}, fmt.Errorf("error while selecting all policies details: %w", err)
	}

	return policies, policiesDetils, nil
}

func (r *PolicyPostgres) GetPolicyById(policyId int) (entity.Policy, entity.PolicyDetails, error) {
	var policy entity.Policy
	query := fmt.Sprintf(`SELECT id, client_id, policy_type, start_date, end_date, premium FROM %s WHERE id = $1`, policiesTable)

	err := r.db.Get(&policy, query, policyId)
	if err != nil {
		return entity.Policy{}, entity.PolicyDetails{}, err
	}

	var details entity.PolicyDetails
	queryDetails := fmt.Sprintf(`SELECT policy_id, details FROM %s WHERE policy_id = $1`, policyDetailsTable)

	err = r.db.Get(&details, queryDetails, policyId)
	if err != nil {
		return entity.Policy{}, entity.PolicyDetails{}, err
	}

	return policy, details, nil
}

func (r *PolicyPostgres) UpdatePolicyById(policyId int, input entity.UpdatePolicyInput) error {
	setValues := make([]string, 0)
	args := make([]interface{}, 0)
	argId := 1

	if input.StartDate != nil {
		setValues = append(setValues, fmt.Sprintf("start_date=$%d", argId))
		args = append(args, *input.StartDate)
		argId++
	}
	if input.EndDate != nil {
		setValues = append(setValues, fmt.Sprintf("end_date=$%d", argId))
		args = append(args, *input.EndDate)
		argId++
	}
	if input.Premium != nil {
		setValues = append(setValues, fmt.Sprintf("premium=$%d", argId))
		args = append(args, *input.Premium)
		argId++
	}

	setQuery := strings.Join(setValues, ", ")

	query := fmt.Sprintf("UPDATE %s SET %s WHERE id=$%d", policiesTable, setQuery, argId)
	args = append(args, policyId)

	_, err := r.db.Exec(query, args...)

	return err
}

func (r *PolicyPostgres) DeletePolicyById(policyId int) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", policiesTable)

	_, err := r.db.Exec(query, policyId)

	return err
}
