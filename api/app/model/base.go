package model

import (
	"gorn/gorn"
	"reflect"
	"time"

	"gorm.io/gorm"
)

type BaseModel struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (b *BaseModel) Init() {

}

func (a *BaseModel) Save(model any) *gorm.DB {
	stmt := &gorm.Statement{DB: gorn.DB}
	stmt.Parse(model)
	table := stmt.Schema.Table
	ref := reflect.ValueOf(model)
	id := reflect.Indirect(ref).FieldByName("ID").Interface().(uint)

	ret := gorn.DB.Save(model)

	log := Log{}
	log.ItemId = reflect.Indirect(ref).FieldByName("ID").Interface().(uint)
	log.UserId = reflect.Indirect(ref).FieldByName("UserId").Interface().(uint)
	log.Module = table
	if id == 0 {
		log.Action = "create"
	} else {
		log.Action = "update"
	}
	gorn.DB.Save(&log)

	return ret
}

func (a *BaseModel) Delete(model any) *gorm.DB {
	stmt := &gorm.Statement{DB: gorn.DB}
	stmt.Parse(model)
	table := stmt.Schema.Table

	ret := gorn.DB.Delete(model)
	ref := reflect.ValueOf(model)

	log := Log{}
	log.ItemId = reflect.Indirect(ref).FieldByName("ID").Interface().(uint)
	log.UserId = reflect.Indirect(ref).FieldByName("UserId").Interface().(uint)
	log.Module = table
	log.Action = "delete"
	field := reflect.Indirect(ref).FieldByName("Title")
	title := ""
	if field.IsValid() {
		title = field.String()

	} else {
		name := reflect.Indirect(ref).FieldByName("Title")
		if name.IsValid() {
			title = name.String()
		}
	}
	log.Description = title
	gorn.DB.Save(&log)

	return ret
}
