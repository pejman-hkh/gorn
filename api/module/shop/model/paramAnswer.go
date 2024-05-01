package shopModel

import (
	"gorn/app/hmodel"
	"gorn/app/model"
)

type ShopParamAnswer struct {
	model.BaseModel
	Title      string            `json:"title"`
	UserId     uint              `gorm:"index" json:"user_id"`
	QuestionId uint              `gorm:"index"`
	User       hmodel.User       `json:"user"`
	Question   ShopParamQuestion `json:"question"`
}
