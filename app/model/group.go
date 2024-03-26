package model

type Group struct {
	BaseModel
	Title  string `gorm:"varchar:255"`
	UserId uint   `gorm:"index"`
}
