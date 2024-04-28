package shopModel

import (
	"gorn/app/hmodel"
	"gorn/app/model"
)

type ShopProduct struct {
	model.BaseModel
	Lang         string       `gorm:"size:20;index" json:"lang"`
	Title        string       `gorm:"size:255" json:"title"`
	Url          string       `gorm:"size:255;index:url_idx" json:"url"`
	UserId       uint         `gorm:"index" json:"user_id"`
	CategoryId   uint         `gorm:"index" json:"category_id"`
	Status       uint8        `json:"status" gorm:"index:status_idx"`
	User         hmodel.User  `json:"user"`
	ShortContent string       `json:"short_content"`
	Content      string       `json:"content"`
	CommentAllow bool         `json:"comment_allow"`
	Category     ShopCategory `json:"category"`
}
