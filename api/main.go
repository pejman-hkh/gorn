package main

import (
	"flag"
	"fmt"
	"gorn/app/controller"
	"gorn/app/middle"
	"gorn/app/model"
	"gorn/gorn"

	"github.com/gin-gonic/gin"
)

func main() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered in f", r)
		}
	}()

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
	r.Use(middle.Cors())
	controller.InitIndex(r)
	controller.InitUser(r)
	controller.InitMenu(r)
	// user := &controller.UserController{}
	// user.InitRoutes(r)

	r.Run(":8090")

}
