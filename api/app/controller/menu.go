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
	Title    string `form:"title" binding:"required"`
	Url      string `form:"url" binding:"required"`
	MenuId   uint   `form:"menuid"`
	Status   uint8  `form:"status"`
	Icon     string `form:"icon"`
	Svg      string `form:"svg"`
	Position uint8  `form:"position"`
}

type MenuController struct {
	BaseController
}

func InitMenu(r *gin.RouterGroup) {
	index := &MenuController{}
	index.InitRoutes(r)
}

func (c *MenuController) InitRoutes(r *gin.RouterGroup) {
	g := r.Group("admin/menus")
	g.Use(middle.IsAdmin())
	{
		g.GET("", c.Index)
		g.GET("/index", c.Index)
		g.GET("/create", c.Create)
		g.POST("/create", c.Store)
		g.GET("/:id/edit", c.Edit)
		g.POST("/:id", c.Update)
		g.DELETE("/:id", c.Destroy)
		g.POST("/actions", c.Actions)
	}
}

func (c *MenuController) Index(ctx *gin.Context) {
	list := []model.Menu{}
	var p gorn.Paginator
	search := []string{"title", "url"}
	asearch := map[string]string{"title": "like", "url": "like"}
	result := gorn.DB.Preload("User").Scopes(c.Search(ctx, &list, search)).Scopes(c.AdvancedSearch(ctx, &list, asearch)).Scopes(p.Paginate(ctx, &list)).Order("Id desc").Find(&list)
	if result.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": result.Error})
		return
	}
	if ctx.Query("excel") != "" {
		c.makeExcel(ctx, []string{}, list)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"list": list, "pagination": p}})
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

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Saved successfully", "data": map[string]any{"model": menu}})
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

func (c *MenuController) Actions(ctx *gin.Context) {

	type Actions struct {
		Action string `form:"action" binding:"required"`
		Ids    []uint `form:"ids[]" binding:"required"`
	}
	var body Actions
	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": err.Error()})
		return
	}

	ids := body.Ids
	menu := model.Menu{}
	gorn.DB.Delete(&menu, ids)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Deleted successfully"})
}
