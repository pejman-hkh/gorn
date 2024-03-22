package model

type Group struct {
	BaseModel
	Title  string `gorm:"size(255)"`
	UserId uint   `gorm:"index"`
}
