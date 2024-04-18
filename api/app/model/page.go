package model

import "gorn/app/hmodel"

type Page struct {
	BaseModel
	Title        string `gorm:"size:255" json:"title"`
	Url          string `gorm:"size:255;index:url_idx" json:"url"`
	Content      string `json:"content"`
	UserId       uint   `gorm:"index" json:"user_id"`
	CommentAllow bool
	Status       uint8       `gorm:"index:status_idx" json:"status"`
	User         hmodel.User `json:"user"`
}
