package model

import (
	"gorn/gorn"

	"gorm.io/gorm"
)

type BaseModel struct {
	gorm.Model
}

func (b *BaseModel) Init() {

}

func (b *BaseModel) Save(m any) *gorm.DB {
	return gorn.DB.Save(m)
}
