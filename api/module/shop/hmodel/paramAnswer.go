package hshopModel

import "gorn/app/model"

type ShopParamAnswer struct {
	model.BaseModel
	Title      string `json:"title"`
	QuestionId uint   `gorm:"index"`
}
