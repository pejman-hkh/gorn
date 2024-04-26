package main

import (
	"flag"
	"fmt"
	"gorn/app"
	"gorn/app/middle"
	"gorn/gorn"
	"gorn/module/shop"

	"github.com/gin-gonic/gin"
)

func main() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered in f", r)
		}
	}()

	var mflag bool
	var sflag bool
	flag.BoolVar(&mflag, "m", false, "migrates")
	flag.BoolVar(&sflag, "s", false, "seeds")
	flag.Parse()
	gr := gorn.Gorn{}
	gr.Init()

	if mflag {
		app.Migirations()
		shop.Migirations()
		return
	}

	if sflag {
		app.Seeds()
		return
	}

	r := gin.Default()
	r.Use(middle.Cors(), middle.Global())
	g := r.Group("api/v1")
	app.Init(g)
	shop.Init(g)
	r.Run(":8090")

}
