package model

import (
	"gorn/gorn"
	"time"

	"gorm.io/gorm"
)

type BaseModel struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (b *BaseModel) Migirations() {
	gorn.DB.AutoMigrate(User{})
	gorn.DB.AutoMigrate(Group{})
	gorn.DB.AutoMigrate(Menu{})
	gorn.DB.AutoMigrate(Permission{})
	gorn.DB.AutoMigrate(Page{})
	gorn.DB.AutoMigrate(Media{})
}

func (b *BaseModel) Init() {

}

func (a *BaseModel) Save(model any) *gorm.DB {

	return gorn.DB.Save(model)
}
