package repository

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"insurance/internal/entity"
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
	query := `	INSERT INTO policies (client_id, policy_type, start_date, end_date, premium) VALUES ($1, $2, $3, $4, $5) RETURNING id`

	err = tx.QueryRow(query, policy.ClientId, policy.PolicyType, policy.StartDate, policy.EndDate, policy.Premium).Scan(&policyID)
	if err != nil {
		return 0, fmt.Errorf("failed to insert policy: %w", err)
	}

	// Вставка деталей
	detailQuery := `INSERT INTO policy_details (policy_id, details)	VALUES ($1, $2)	`
	_, err = tx.Exec(detailQuery, policyID, details.Details)
	if err != nil {
		return 0, fmt.Errorf("failed to insert policy details: %w", err)
	}

	return policyID, nil
}

func (r *PolicyPostgres) GetAllPolicyById(id int) ([]entity.Policy, []entity.PolicyDetails, error) {
	var policies []entity.Policy
	query := `SELECT id, client_id, policy_type, start_date, end_date, premium FROM policies WHERE client_id = $1`

	err := r.db.Select(&policies, query, id)

	if err != nil {
		return []entity.Policy{}, []entity.PolicyDetails{}, fmt.Errorf("policy not found: %w", err)
	}

	var details []entity.PolicyDetails

	for _, policy := range policies {
		var temp entity.PolicyDetails
		detailQuery := `SELECT policy_id, details FROM policy_details WHERE policy_id = $1`

		err = r.db.Get(&temp, detailQuery, policy.Id)

		if err != nil {
			return policies, []entity.PolicyDetails{}, fmt.Errorf("policy details not found: %w", err)
		}
		details = append(details, temp)
	}

	return policies, details, nil
}

////func (r *PolicyPostgres) GetAllPolicies() ([]entity.Policy, error) {
////
////}
////
////func (r *PolicyPostgres) GetPolicyById(id int) (entity.Policy, error) {
////
////}
////
////func (r *PolicyPostgres) DeletePolicyById(id int) error {
////
////}
////
////func (r *PolicyPostgres) UpdatePolicyById(id int, input *entity.UpdatePolicyInput) error {
////
////}
