package shopModel

import (
	"gorn/app/hmodel"
	"gorn/app/model"
	hshopModel "gorn/module/shop/hmodel"
)

type ShopParamQuestion struct {
	model.BaseModel
	Title      string                       `gorm:"size:255" json:"title"`
	Name       string                       `gorm:"size:255" json:"name"`
	UserId     uint                         `gorm:"index" json:"user_id"`
	CategoryId uint                         `gorm:"index"`
	Status     uint8                        `json:"status" gorm:"index:status_idx"`
	User       hmodel.User                  `json:"user"`
	Category   ShopParamCategory            `json:"category"`
	Answers    []hshopModel.ShopParamAnswer `gorm:"foreignKey:QuestionId" json:"answers"`
}
