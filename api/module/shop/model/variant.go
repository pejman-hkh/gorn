package shopModel

import (
	"gorn/app/hmodel"
	"gorn/app/model"
)

type ShopVariant struct {
	model.BaseModel
	Lang       string      `gorm:"size:20;index" json:"lang"`
	Title      string      `gorm:"size:255" json:"title"`
	UserId     uint        `gorm:"index" json:"user_id"`
	CategoryId uint        `gorm:"index"`
	Status     uint8       `json:"status" gorm:"index:status_idx"`
	User       hmodel.User `json:"user"`
	Values     string      `json:"values"`
}
