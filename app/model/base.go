package model

import (
	"gorn/gorn"

	"gorm.io/gorm"
)

type BaseModel struct {
	gorm.Model
}

func (b *BaseModel) Migirations() {
	gorn.DB.AutoMigrate(User{})
	gorn.DB.AutoMigrate(Group{})
	gorn.DB.AutoMigrate(Menu{})
}

func (b *BaseModel) Init() {

}

func (a *BaseModel) Save(body any) *gorm.DB {

	return gorn.DB.Save(body)
}
