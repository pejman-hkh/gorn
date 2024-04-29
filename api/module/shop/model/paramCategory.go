package shopModel

import (
	"gorn/app/hmodel"
	"gorn/app/model"
)

type ShopParamCategory struct {
	model.BaseModel
	Title      string              `gorm:"size:255" json:"title"`
	UserId     uint                `gorm:"index" json:"user_id"`
	CategoryId uint                `gorm:"index"`
	Status     uint8               `json:"status" gorm:"index:status_idx"`
	User       hmodel.User         `json:"user"`
	Category   ShopCategory        `json:"category"`
	Questions  []ShopParamQuestion `gorm:"foreignKey:CategoryId" json:"questions"`
}
