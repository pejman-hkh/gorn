package controller

import (
	"fmt"
	"gorn/app/middle"
	"gorn/app/model"
	"gorn/gorn"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
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
		g.POST("/create", c.Store)
		g.GET("/:id/edit", c.Edit)
		g.POST("/:id", c.Update)
		g.DELETE("/:id", c.Destroy)
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

	copier.Copy(&menu, &body)
	menu.UserId = user.(*model.User).ID

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
	copier.Copy(menu, body)
	menu.UserId = user.(*model.User).ID

	save := menu.Save(menu)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Saved successfully"})
}

func (c *MenuController) Destroy(ctx *gin.Context) {
	menu := model.Menu{}
	gorn.DB.First(&menu, ctx.Param("id"))
	gorn.DB.Delete(&menu)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Deleted successfully"})
}
