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
	Title  string `form:"title" binding:"required"`
	Url    string `form:"url" binding:"required"`
	MenuId uint
	Status uint8
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
	g.Use(middle.IsAdmin())
	{
		g.GET("/", c.Index)
		g.GET("/index", c.Index)
		g.GET("/create", c.Create)
		g.GET("/:id/edit", c.Edit)
		g.POST("/:id", c.Update)
		g.POST("/create", c.Store)
	}
}

func (c *MenuController) Index(ctx *gin.Context) {
	list := []model.Menu{}
	c.parentIndex(ctx, list)
}

func (c *MenuController) Edit(ctx *gin.Context) {
	model := model.Menu{}
	c.parentEdit(ctx, &model)
}

func (c *MenuController) Update(ctx *gin.Context) {
	var body MenuForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	menu := model.Menu{}
	gorn.DB.First(&menu, ctx.Param("id"))

	menu.Title = body.Title
	menu.Url = body.Url
	menu.MenuId = body.MenuId
	menu.UserId = user.(*model.User).ID
	menu.Status = body.Status

	save := menu.Save(menu)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Saved successfully"})
}

func (c *MenuController) Create(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"model": model.Menu{}}})
}

func (c *MenuController) Store(ctx *gin.Context) {
	var body MenuForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")

	menu := &model.Menu{}
	menu.Title = body.Title
	menu.Url = body.Url
	menu.MenuId = body.MenuId
	menu.UserId = user.(*model.User).ID
	menu.Status = body.Status

	save := menu.Save(menu)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Saved successfully"})
}

func (c *MenuController) Destroy(ctx *gin.Context) {

}
