package entity

import "time"

type Policy struct {
	Id         int       `json:"id" db:"id"`
	ClientId   int       `json:"client_id" binding:"required" db:"client_id"`
	PolicyType string    `json:"policy_type" binding:"required" db:"policy_type"`
	StartDate  time.Time `json:"start_date" binding:"required" db:"start_date"`
	EndDate    time.Time `json:"end_date" binding:"required" db:"end_date"`
	Premium    int       `json:"premium" binding:"required" db:"premium"`
}
