package model

type Menu struct {
	BaseModel
	Title    string `gorm:"size:255"`
	UserId   uint   `gorm:"index"`
	MenuId   uint   `gorm:"index"`
	Url      string `gorm:"size:255"`
	Icon     string `gorm:"size:255"`
	Svg      string
	Priority uint
	Position uint8
	Status   uint8
	User     User
}
