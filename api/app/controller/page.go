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

type PageForm struct {
	Title        string `form:"title" binding:"required"`
	Url          string `form:"url" binding:"required"`
	Status       uint8  `form:"status"`
	Content      string `form:"content"`
	ShortContent string `form:"short_content"`
	CommentAllow bool   `form:"comment_allow"`
}

type PageController struct {
	BaseController
}

func InitPage(r *gin.RouterGroup) {
	index := &PageController{}
	index.InitRoutes(r)
}

func (c *PageController) InitRoutes(r *gin.RouterGroup) {
	g := r.Group("admin/pages")
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

func (c *PageController) Index(ctx *gin.Context) {
	list := []model.Page{}
	var p gorn.Paginator
	search := []string{"title", "url", "content"}
	asearch := map[string]string{"title": "like", "url": "like", "status": "=", "has_comment": "="}
	result := gorn.DB.Preload("User").Scopes(c.Search(ctx, &list, search)).Scopes(c.AdvancedSearch(ctx, &list, asearch)).Scopes(p.Paginate(ctx, &list)).Order("Id desc").Find(&list)
	if result.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": result.Error})
		return
	}
	if ctx.Query("excel") != "" {
		c.MakeExcel(ctx, []string{}, list)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"list": list, "pagination": p}})
}

func (c *PageController) Edit(ctx *gin.Context) {
	model := model.Page{}
	c.ParentEdit(ctx, &model)
}

func (c *PageController) Update(ctx *gin.Context) {
	var body PageForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	page := model.Page{}
	gorn.DB.First(&page, ctx.Param("id"))

	copier.Copy(&page, &body)
	page.UserId = user.(*model.User).ID

	save := page.Save(page)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully"), "data": map[string]any{"model": page}})
}

func (c *PageController) Create(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"model": model.Page{}}})
}

func (c *PageController) Store(ctx *gin.Context) {
	var body PageForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")

	page := &model.Page{}
	copier.Copy(page, body)
	page.UserId = user.(*model.User).ID

	save := page.Save(page)

	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully")})
}

func (c *PageController) Destroy(ctx *gin.Context) {
	page := model.Page{}
	gorn.DB.First(&page, ctx.Param("id"))
	page.Delete(&page)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}

func (c *PageController) Actions(ctx *gin.Context) {

	type Actions struct {
		Action string `form:"action" binding:"required"`
		Ids    []uint `form:"ids[]" binding:"required"`
	}
	var body Actions
	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	ids := body.Ids
	page := model.Page{}
	gorn.DB.Delete(&page, ids)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}
