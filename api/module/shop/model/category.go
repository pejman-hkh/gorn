package shopModel

import (
	"gorn/app/hmodel"
	"gorn/app/model"
)

type ShopCategory struct {
	model.BaseModel
	Title       string `gorm:"size:255" json:"title"`
	Url         string `gorm:"size:255;index:url_idx" json:"url"`
	UserId      uint   `gorm:"index" json:"user_id"`
	CategoryId  uint   `gorm:"index"`
	Priority    uint
	Status      uint8       `json:"status" gorm:"index:status_idx"`
	User        hmodel.User `json:"user"`
	Description string      `json:"description"`
}
