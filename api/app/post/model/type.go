package postModel

import (
	"gorn/app/hmodel"
	"gorn/app/model"
)

type PostType struct {
	model.BaseModel
	Lang   string      `gorm:"size:20;index" json:"lang"`
	Title  string      `gorm:"size:255" json:"title"`
	Url    string      `gorm:"size:255;index:url_idx" json:"url"`
	UserId uint        `gorm:"index" json:"user_id"`
	Status uint8       `json:"status" gorm:"index:status_idx"`
	User   hmodel.User `json:"user"`
}
