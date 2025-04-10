package entity

import (
	"encoding/json"
	"errors"
	"time"
)

type Policy struct {
	Id         int       `json:"id" db:"id"`
	ClientId   int       `json:"client_id" binding:"required" db:"client_id"`
	PolicyType string    `json:"policy_type" binding:"required" db:"policy_type"`
	StartDate  time.Time `json:"start_date" binding:"required" db:"start_date"`
	EndDate    time.Time `json:"end_date" binding:"required" db:"end_date"`
	Premium    int       `json:"premium" binding:"required" db:"premium"`
}

type PolicyRequest struct {
	Type      string          `json:"type"`
	StartDate string          `json:"start_date"`
	EndDate   string          `json:"end_date"`
	Premium   int             `json:"premium"`
	Details   json.RawMessage `json:"details"`
}

type PolicyResponse struct {
	ID        int             `json:"id"`
	ClientID  int             `json:"client_id"`
	Type      string          `json:"type"`
	StartDate string          `json:"start_date"`
	EndDate   string          `json:"end_date"`
	Premium   int             `json:"premium"`
	Details   json.RawMessage `json:"details"`
}

type UpdatePolicyInput struct {
	StartDate *string `json:"start_date"`
	EndDate   *string `json:"end_date"`
	Premium   *int    `json:"premium"`
}

func (i UpdatePolicyInput) Validate() error {
	if i.StartDate == nil && i.EndDate == nil && i.Premium == nil {
		errors.New("empty update input")
	}
	return nil

}

const (
	TypeCar       = "car"
	TypeApartment = "apartment"
	TypeHealth    = "health"
	TypeCrypto    = "crypto"
)

var TypePolicy map[string]bool

func init() {
	TypePolicy = map[string]bool{TypeCar: true, TypeApartment: true, TypeHealth: true, TypeCrypto: true}
}
