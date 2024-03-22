package controller

import (
	"gorn/gorn"

	"github.com/gin-gonic/gin"
)

type IndexController struct {
	BaseController
}

func (c *IndexController) InitRoutes(r *gin.Engine) {
	r.GET("/", gorn.HandleJson(c, "Index"))
	r.GET("/home", gorn.HandleJson(c, "Index"))
	r.GET("/about", gorn.HandleJson(c, "About"))
	r.GET("/contact", gorn.HandleJson(c, "Contact"))
	r.POST("/contact", gorn.HandleJson(c, "ContactPost"))
}

func (c *IndexController) Index(ctx *gin.Context) any {

	c.Set("data", "test")

	return c.Flash("ok", 1)
}

func (c *IndexController) About(ctx *gin.Context) any {
	ret := make(map[string]string)
	ret["data"] = "test"
	return c.Flash(ret)
}

func (c *IndexController) Contact(ctx *gin.Context) any {
	return c.Flash("ok")
}

func (c *IndexController) ContactPost(ctx *gin.Context) any {
	ret := make(map[string]string)
	ret["data"] = "test"
	return ret
}
