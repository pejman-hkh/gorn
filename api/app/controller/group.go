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

type GroupForm struct {
	Title string `form:"title" binding:"required"`
}

type GroupController struct {
	BaseController
}

func InitGroup(r *gin.RouterGroup) {
	index := &GroupController{}
	index.InitRoutes(r)
}

func (c *GroupController) InitRoutes(r *gin.RouterGroup) {
	g := r.Group("admin/groups")
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

func (c *GroupController) Index(ctx *gin.Context) {
	list := []model.Group{}
	var p gorn.Paginator
	search := []string{"title"}
	asearch := map[string]string{"title": "like"}
	result := gorn.DB.Scopes(c.Search(ctx, &list, search)).Scopes(c.AdvancedSearch(ctx, &list, asearch)).Scopes(p.Paginate(ctx, &list)).Order("id desc").Find(&list)
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

func (c *GroupController) Edit(ctx *gin.Context) {
	model := model.Group{}
	c.parentEdit(ctx, &model)
}

func (c *GroupController) Update(ctx *gin.Context) {
	var body GroupForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	Group := model.Group{}
	gorn.DB.First(&Group, ctx.Param("id"))

	copier.Copy(&Group, &body)
	Group.UserId = user.(*model.User).ID

	save := Group.Save(Group)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Saved successfully", "data": map[string]any{"model": Group}})
}

func (c *GroupController) Create(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"model": model.Group{}}})
}

func (c *GroupController) Store(ctx *gin.Context) {
	var body GroupForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")

	Group := &model.Group{}
	copier.Copy(Group, body)
	Group.UserId = user.(*model.User).ID

	save := Group.Save(Group)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Saved successfully"})
}

func (c *GroupController) Destroy(ctx *gin.Context) {
	Group := model.Group{}
	gorn.DB.First(&Group, ctx.Param("id"))
	gorn.DB.Delete(&Group)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Deleted successfully"})
}

func (c *GroupController) Actions(ctx *gin.Context) {

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
	Group := model.Group{}
	gorn.DB.Delete(&Group, ids)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Deleted successfully"})
}