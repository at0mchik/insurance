package entity

import "time"

type AssessmentResult struct {
	Id         int       `json:"id" db:"id"`
	RequestId  int       `json:"request_id" binding:"required" db:"request_id"`
	AssessorId int       `json:"assessor_id" binding:"required" db:"assessor_id"`
	ManagerId  int       `json:"manager_id" binding:"required" db:"manager_id"`
	ResultText string    `json:"result_text" binding:"required" db:"result_text"`
	Value      int       `json:"value" binding:"required" db:"value"`
	ResultDate time.Time `json:"date" binding:"required" db:"date"`
}
