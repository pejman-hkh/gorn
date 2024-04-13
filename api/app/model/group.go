package model

type Group struct {
	BaseModel
	Title  string `gorm:"size:255" json:"title"`
	UserId uint   `gorm:"index" json:"userid"`
	//User   User   `json:"user"`
}
