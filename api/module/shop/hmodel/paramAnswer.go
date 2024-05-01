package hshopModel

type ShopParamAnswer struct {
	ID         uint   `gorm:"primarykey" json:"id"`
	Title      string `json:"title"`
	QuestionId uint   `gorm:"index"`
}
