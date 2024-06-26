package model

import "gorn/app/hmodel"

type Page struct {
	BaseModel
	Title        string      `gorm:"size:255" json:"title"`
	Url          string      `gorm:"size:255;index:url_idx" json:"url"`
	Content      string      `json:"content"`
	ShortContent string      `json:"short_content"`
	UserId       uint        `gorm:"index" json:"user_id"`
	CommentAllow bool        `json:"comment_allow"`
	Status       uint8       `gorm:"index:status_idx" json:"status"`
	User         hmodel.User `json:"user"`
}
