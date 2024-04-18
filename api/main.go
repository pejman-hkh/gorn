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

	//gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	r.Use(middle.Cors(), middle.Global())
	g := r.Group("api/v1")
	controller.InitIndex(g)
	controller.InitUser(g)
	controller.InitMenu(g)
	controller.InitGroup(g)
	controller.InitPage(g)
	controller.InitMedia(g)

	// r.GET("/*", func(ctx *gin.Context) {
	// 	//buf, _ := ioutil.ReadFile("../admin/dist/index.html")

	// 	ctx.HTML(http.StatusOK, "../admin/dist/index.html", nil)
	// })

	r.Run(":8090")

}
