package hmodel

type User struct {
	ID    uint   `json:"id"`
	Name  string `json:"name" gorm:"size:255"`
	Email string `json:"email" gorm:"type:varchar(100);index:idx_email"`
}
