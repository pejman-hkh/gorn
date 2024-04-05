package main

import (
	"io/ioutil"
	"strings"

	"github.com/gin-gonic/gin"
)

func main() {

	admin, _ := ioutil.ReadFile("admin/dist/index.html")
	site, _ := ioutil.ReadFile("site/index.html")

	static := gin.New()
	static.Static("/assets", "./admin/dist/assets/")

	r := gin.Default()
	r.GET("/*site", func(ctx *gin.Context) {
		param := ctx.Param("site")
		paramSplit := strings.Split(param, "/")

		if paramSplit[1] == "admin" {
			ctx.Data(200, "text/html", admin)
		} else if paramSplit[1] == "assets" {
			static.HandleContext(ctx)
		} else {
			ctx.Data(200, "text/html", site)
		}
	})

	r.Run(":8091")
}
