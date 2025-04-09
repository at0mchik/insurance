package entity

import (
	"time"
)

type AssessmentRequest struct {
	Id          int       `json:"id" db:"id"`
	ClientId    int       `json:"client_id" binding:"required" db:"client_id"`
	PolicyId    int       `json:"policy_id" binding:"required" db:"policy_id"`
	AssessorId  int       `json:"assessor_id" binding:"required" db:"assessor_id"`
	RequestDate time.Time `json:"request_date" binding:"required" db:"start_date"`
	Status      string    `json:"status" binding:"required" db:"status"`
}

type AssessmentRequestInput struct {
	PolicyId    int    `json:"policy_id"`
	AssessorId  int    `json:"assessor_id"`
	RequestDate string `json:"request_date"`
}

var AssessmentStatuses map[string]bool

const (
	StatusPending   = "pending"
	StatusReady     = "ready"
	StatusCancelled = "cancelled"
)

func init() {
	AssessmentStatuses = map[string]bool{StatusPending: true, StatusReady: true, StatusCancelled: true}
}
