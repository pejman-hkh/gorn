package shopModel

import (
	"gorn/app/model"
)

type ShopPrice struct {
	model.BaseModel
	Title     string `gorm:"size:255" json:"title"`
	UserId    uint   `gorm:"index" json:"user_id"`
	ProductId uint   `gorm:"index"`
	Status    uint8  `json:"status" gorm:"index:status_idx"`
	Price     uint   `json:"price"`
}
