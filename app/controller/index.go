package controller

import (
	"gorn/app/model"
	"gorn/gorn"

	"github.com/gin-gonic/gin"
)

type IndexController struct {
	BaseController
}

func newIndexController(method string) func(*gin.Context) {
	return func(ctx *gin.Context) {
		gorn.HandleJson(ctx, &IndexController{}, method)
	}
}

func (c *IndexController) InitRoutes(r *gin.Engine) {
	r.GET("/", newIndexController("Index"))
	r.GET("/home", newIndexController("Index"))
	r.GET("/about", newIndexController("About"))
	r.GET("/contact", newIndexController("Contact"))
	r.POST("/contact", newIndexController("ContactPost"))
}

func (c *IndexController) Index(ctx *gin.Context) any {
	users := []model.User{}
	result := gorn.DB.Find(&users)
	if result.Error == nil {
		c.Set("users", users)
	}

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
