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
	gorn.DB.AutoMigrate(Permission{})
}

func (b *BaseModel) Init() {

}

func (a *BaseModel) Save(model any) *gorm.DB {

	return gorn.DB.Save(model)
}
