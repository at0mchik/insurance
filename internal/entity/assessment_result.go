package entity

import (
	"errors"
	"time"
)

type AssessmentResult struct {
	Id         int       `json:"id" db:"id"`
	RequestId  int       `json:"request_id" binding:"required" db:"request_id"`
	AssessorId int       `json:"assessor_id" binding:"required" db:"assessor_id"`
	ResultText string    `json:"result_text" binding:"required" db:"result_text"`
	Value      int       `json:"value" binding:"required" db:"value"`
	ResultDate time.Time `json:"date" binding:"required" db:"date"`
}

type AssessmentResultInput struct {
	ResultText string    `json:"result_text"`
	Value      int       `json:"value"`
	ResultDate time.Time `json:"date"`
}

type AssessmentResultUpdateInput struct {
	Status     *string `json:"status"`
	ResultText *string `json:"result_text"`
	Value      *int    `json:"value"`
	ResultDate *string `json:"result_date"`
}

func (i AssessmentResultUpdateInput) Validate() error {
	if i.Status == nil || i.ResultDate == nil || i.ResultText == nil || i.Value == nil {
		errors.New("input not full, add status and data")
	} else if *i.Status == StatusCancelled && i.ResultDate == nil {
		errors.New("input not full, add date to cancel")
	} else if *i.Status == StatusReady || i.ResultDate == nil || i.ResultText == nil || i.Value == nil {
		errors.New("input not full, add data")
	}
	return nil
}

type AssessmentResultResponse struct {
	ResultText string `json:"result_text" db:"result_text"`
	Value      int    `json:"value" db:"value"`
	ResultDate string `json:"result_date" db:"result_date"`
}

const (
	EmptyResult              = "empty"
	AssessorAssignedNoResult = "assigned"
)
