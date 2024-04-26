package model

import (
	"gorn/app/hmodel"
)

type Log struct {
	BaseModel
	UserId      uint        `gorm:"index" json:"user_id"`
	Status      uint8       `json:"status" gorm:"index:status_idx"`
	User        hmodel.User `json:"user"`
	Module      string      `gorm:"index:item_idx" json:"module"`
	ItemId      uint        `gorm:"index:item_idx" json:"item_id"`
	Description string      `json:"description"`
	Action      string      `gorm:"size:255" json:"action"`
}
