package controller

import (
	"fmt"
	"gorn/app/middle"
	"gorn/app/model"
	"gorn/gorn"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MenuForm struct {
	Title  string `binding:"required"`
	Url    string `binding:"required"`
	MenuId uint
}

type MenuController struct {
	BaseController
}

func InitMenu(r *gin.Engine) {
	index := &MenuController{}
	index.InitRoutes(r)
}

func (c *MenuController) InitRoutes(r *gin.Engine) {
	g := r.Group("/menus")
	g.Use(middle.AuthRequired())
	{
		g.GET("/", c.Index)
		g.GET("/index", c.Index)
		g.GET("/store", c.Store)
	}
}

func (c *MenuController) Index(ctx *gin.Context) {
	list := []model.Menu{}
	var p gorn.Paginator

	result := gorn.DB.Scopes(p.Paginate(ctx, &list)).Find(&list)
	if result.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": result.Error})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"list": list, "paginate": p}})
}

func (c *MenuController) Store(ctx *gin.Context) {
	var body MenuForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": err})
		return
	}

	menu := &model.Menu{}

	menu.Title = body.Title
	menu.Url = body.Url
	menu.MenuId = body.MenuId
	save := menu.Save(menu)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Saved successfully"})
}
