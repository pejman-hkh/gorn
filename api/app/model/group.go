package model

import (
	"fmt"
	"gorn/app/hmodel"
	"gorn/gorn"
)

type Group struct {
	BaseModel
	Title       string       `gorm:"size:255" json:"title"`
	UserId      uint         `gorm:"index" json:"user_id"`
	User        hmodel.User  `json:"user"`
	Permissions []Permission `json:"permissions"`
}

func (g *Group) SetPermission(userid uint, groupid uint, body map[string]any) {
	if body["permission"] == nil {
		return
	}

	permissions := body["permission"].(map[string]any)
	fmt.Print(permissions)
	for module, permission := range permissions {
		per := Permission{}
		check := gorn.DB.Where("group_id = ? and module = ? ", groupid, module).First(&per)
		if check.RowsAffected == 0 {
			per = Permission{}
		}

		per.GroupID = groupid
		per.UserID = userid
		per.Module = module
		if permission.(map[string]any)["create"] == "on" {
			per.Create = true
		} else {
			per.Create = false
		}

		if permission.(map[string]any)["delete"] == "on" {
			per.Delete = true
		} else {
			per.Delete = false
		}
		if permission.(map[string]any)["update"] == "on" {
			per.Update = true
		} else {
			per.Update = false
		}
		if permission.(map[string]any)["view"] == "on" {
			per.View = true
		} else {
			per.View = false
		}

		gorn.DB.Save(&per)
	}
}
