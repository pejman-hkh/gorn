package main

import (
	"flag"
	"gorn/app/controller"
	"gorn/app/model"
	"gorn/gorn"

	"github.com/gin-gonic/gin"
)

func main() {
	var mflag bool
	flag.BoolVar(&mflag, "m", false, "migrates")
	flag.Parse()
	gr := gorn.Gorn{}
	gr.Init()

	if mflag {
		b := model.BaseModel{}
		b.Migirations()
		return
	}

	r := gin.Default()
	r.Static("/assets", "./public")

	index := &controller.IndexController{}
	index.InitRoutes(r)

	user := &controller.UserController{}
	user.InitRoutes(r)

	r.Run(":8090")

}
