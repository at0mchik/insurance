package entity

type AssesmentRequest struct {
	Id          int    `json:"id" db:"id"`
	ClientId    int    `json:"client_id" binding:"required" db:"client_id"`
	PolicyId    int    `json:"policy_id" binding:"required" db:"policy_id"`
	AssessorId  int    `json:"assessor_id" binding:"required" db:"assessor_id"`
	ManagerId   int    `json:"manager_id" binding:"required" db:"manager_id"`
	RequestDate string `json:"start_date" binding:"required" db:"start_date"`
	Status      string `json:"status" binding:"required" db:"status"`
}
