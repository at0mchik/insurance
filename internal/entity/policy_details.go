package entity

type PolicyDetails struct {
	Id       int    `json:"id" db:"id"`
	PolicyId int    `json:"policy_id" bindings:"required" db:"policy_id"`
	Details  string `json:"details" bindings:"required" db:"details"`
}
