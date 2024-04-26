package seeder

import (
	"gorn/app/model"
	"gorn/gorn"
)

func InitUser() {
	user := model.User{}
	find := gorn.DB.Where("email = ?", "admin@local.loc").First(&user)
	if find.RowsAffected == 0 {
		user.Email = "admin@local.loc"
		user.Name = "admin"
		user.Password = "admin"
		user.IsAdmin = true
		user.IsMain = true
		gorn.DB.Save(&user)
	}
}
