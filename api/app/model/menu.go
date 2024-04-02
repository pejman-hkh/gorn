package model

type Menu struct {
	BaseModel
	Title    string `gorm:"size:255" json:"title"`
	UserId   uint   `gorm:"index" json:"userid"`
	MenuId   uint   `gorm:"index" json:"menuid"`
	Url      string `gorm:"size:255" json:"url"`
	Icon     string `gorm:"size:255" json:"icon"`
	Svg      string `json:"svg"`
	Priority uint   `json:"priority"`
	Position uint8  `json:"position"`
	Status   uint8  `json:"status"`
	User     User   `json:"user"`
}
