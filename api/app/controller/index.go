package controller

import (
	"gorn/app/middle"
	"gorn/app/model"
	"gorn/gorn"
	"net/http"

	"github.com/gin-gonic/gin"
)

type IndexController struct {
	BaseController
}

func InitIndex(r *gin.RouterGroup) {
	index := &IndexController{}
	index.InitRoutes(r)
}

func (c *IndexController) InitRoutes(r *gin.RouterGroup) {
	g := r.Group("admin/")
	g.Use(middle.IsAdmin())
	{
		g.GET("/", c.Index)
		g.GET("/dashboard", c.Index)
	}

	r.GET("admin/data", c.Data)
	r.GET("/", c.Index)
	r.GET("/home", c.Index)

}

func (c *IndexController) Data(ctx *gin.Context) {
	user, _ := ctx.Get("authUser")
	set := make(map[string]any)
	if user != nil {
		authUser := user.(*model.User)
		group := model.Group{}
		group.ID = authUser.GroupId
		gorn.DB.Preload("Permissions").First(&group)
		set["authUser"] = authUser
		set["group"] = group
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": set})
}

func (c *IndexController) Index(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{}})
}
