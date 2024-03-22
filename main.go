package main

import (
	"gorn/app/controller"
	"gorn/gorn"

	"github.com/gin-gonic/gin"
)

func main() {
	gr := gorn.Gorn{}
	gr.Init()
	r := gin.Default()
	r.Static("/assets", "./public")

	index := &controller.IndexController{}
	index.InitRoutes(r)

	user := &controller.UserController{}
	user.InitRoutes(r)

	r.Run(":8090")

}
