package shopModel

import (
	"gorn/app/hmodel"
	"gorn/app/model"
)

type ShopCategory struct {
	model.BaseModel
	Title       string        `gorm:"size:255" json:"title"`
	Name        string        `gorm:"size:255" json:"name"`
	Url         string        `gorm:"size:255;index:url_idx" json:"url"`
	UserId      uint          `gorm:"index" json:"user_id"`
	CategoryId  uint          `gorm:"index" json:"category_id"`
	Priority    uint          `json:"priority"`
	Status      uint8         `json:"status" gorm:"index:status_idx"`
	User        hmodel.User   `json:"user"`
	Description string        `json:"description"`
	Variants    []ShopVariant `gorm:"foreignKey:CategoryId" json:"variants"`
}
