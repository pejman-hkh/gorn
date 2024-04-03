package controller

import (
	"gorn/app/middle"
	"net/http"

	"github.com/gin-gonic/gin"
)

type IndexController struct {
	BaseController
}

func InitIndex(r *gin.Engine) {
	index := &IndexController{}
	index.InitRoutes(r)
}

func (c *IndexController) InitRoutes(r *gin.Engine) {
	g := r.Group("admin/")
	g.Use(middle.IsAdmin())
	{
		u := UserController{}
		g.GET("/", c.Index)
		g.POST("/", u.LoginPost)
	}

	r.GET("/", c.Index)
	r.GET("/home", c.Index)

}

func (c *IndexController) Index(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{}})
}
