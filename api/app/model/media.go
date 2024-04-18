package model

import (
	"gorn/app/hmodel"

	"github.com/gin-gonic/gin"
)

type Media struct {
	BaseModel
	File        string      `gorm:"size:255" json:"file"`
	Size        uint        `json:"size"`
	UserId      uint        `gorm:"index" json:"user_id"`
	Status      uint8       `json:"status" gorm:"index:status_idx"`
	User        hmodel.User `json:"user"`
	Model       string      `gorm:"index:item_idx"`
	ItemId      string      `gorm:"index:item_idx"`
	Description string
}

func (m *Media) Upload(ctx *gin.Context) {

}
