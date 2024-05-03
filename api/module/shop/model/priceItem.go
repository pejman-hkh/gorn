package shopModel

import (
	"gorn/app/model"
)

type ShopPriceItem struct {
	model.BaseModel
	Title     string `json:"title"`
	UserId    uint   `gorm:"index" json:"user_id"`
	ProductId uint   `gorm:"index"`
	PriceId   uint   `gorm:"index"`
	VariantId uint   `gorm:"index"`
}
