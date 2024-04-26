package model

import "gorn/app/hmodel"

type Page struct {
	BaseModel
	Lang         string `gorm:"size:20;index" json:"lang"`
	Title        string `gorm:"size:255" json:"title"`
	Url          string `gorm:"size:255;index:url_idx" json:"url"`
	Content      string `json:"content"`
	ShortContent string `json:"short_content"`
	UserId       uint   `gorm:"index" json:"user_id"`
	CommentAllow bool
	Status       uint8       `gorm:"index:status_idx" json:"status"`
	User         hmodel.User `json:"user"`
}
