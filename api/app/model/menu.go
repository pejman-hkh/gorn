package model

import "gorn/app/hmodel"

type Menu struct {
	BaseModel
	Title    string      `gorm:"size:255" json:"title"`
	UserId   uint        `gorm:"index" json:"user_id"`
	MenuId   uint        `gorm:"index" json:"menu_id"`
	Url      string      `gorm:"size:255" json:"url"`
	Icon     string      `gorm:"size:255" json:"icon"`
	Svg      string      `json:"svg"`
	Priority uint        `json:"priority"`
	Position uint8       `json:"position"`
	Status   uint8       `json:"status"`
	User     hmodel.User `json:"user"`
}
