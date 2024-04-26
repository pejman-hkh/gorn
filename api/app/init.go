package app

import (
	"gorn/app/controller"
	"gorn/app/model"
	"gorn/app/post"
	"gorn/app/seeder"
	"gorn/gorn"

	"github.com/gin-gonic/gin"
)

func Init(g *gin.RouterGroup) {
	post.Init(g)
	controller.InitIndex(g)
	controller.InitUser(g)
	controller.InitMenu(g)
	controller.InitGroup(g)
	controller.InitPage(g)
	controller.InitMedia(g)
	controller.InitLog(g)
}

func Seeds() {
	seeder.InitUser()
}

func Migirations() {
	post.Migirations()
	gorn.DB.AutoMigrate(model.User{})
	gorn.DB.AutoMigrate(model.Group{})
	gorn.DB.AutoMigrate(model.Menu{})
	gorn.DB.AutoMigrate(model.Permission{})
	gorn.DB.AutoMigrate(model.Page{})
	gorn.DB.AutoMigrate(model.Media{})
	gorn.DB.AutoMigrate(model.Log{})
}
