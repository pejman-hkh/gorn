package shopModel

import (
	"gorn/app/hmodel"
	"gorn/app/model"
)

type ShopParam struct {
	model.BaseModel
	UserId     uint              `gorm:"index" json:"user_id"`
	QuestionId uint              `gorm:"index" json:"question_id"`
	ProductId  uint              `json:"product_id"`
	AnswerId   uint              `json:"answer_id"`
	User       hmodel.User       `json:"user"`
	Question   ShopParamQuestion `json:"question"`
	Short      bool              `json:"short"`
	Answer     ShopParamAnswer   `json:"answer"`
}
