package postController

import (
	"fmt"
	"gorn/app/controller"
	"gorn/app/middle"
	"gorn/app/model"
	postModel "gorn/app/post/model"
	"gorn/gorn"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
)

type TypeForm struct {
	Title       string `form:"title" binding:"required"`
	Url         string `form:"url" binding:"required"`
	Status      uint8  `form:"status"`
	Description string `form:"description"`
}

type TypeController struct {
	controller.BaseController
}

func InitType(r *gin.RouterGroup) {
	index := &TypeController{}
	index.InitRoutes(r)
}

func (c *TypeController) InitRoutes(r *gin.RouterGroup) {
	g := r.Group("admin/post/types")
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

func (c *TypeController) Index(ctx *gin.Context) {
	list := []postModel.PostType{}
	var p gorn.Paginator
	search := []string{"title", "url"}
	asearch := map[string]string{"title": "like", "url": "like", "status": "="}
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

func (c *TypeController) Edit(ctx *gin.Context) {
	model := postModel.PostType{}
	c.ParentEdit(ctx, &model)
}

func (c *TypeController) Update(ctx *gin.Context) {
	var body TypeForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	type1 := postModel.PostType{}
	gorn.DB.First(&type1, ctx.Param("id"))

	copier.Copy(&type1, &body)
	type1.UserId = user.(*model.User).ID

	save := type1.Save(type1)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully"), "data": map[string]any{"model": type1}})
}

func (c *TypeController) Create(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"model": postModel.PostType{}}})
}

func (c *TypeController) Store(ctx *gin.Context) {
	var body TypeForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")

	type1 := &postModel.PostType{}
	copier.Copy(type1, body)
	type1.UserId = user.(*model.User).ID

	save := type1.Save(type1)

	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully")})
}

func (c *TypeController) Destroy(ctx *gin.Context) {
	type1 := postModel.PostType{}
	gorn.DB.First(&type1, ctx.Param("id"))
	type1.Delete(&type1)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}

func (c *TypeController) Actions(ctx *gin.Context) {

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
	type1 := postModel.PostType{}
	gorn.DB.Delete(&type1, ids)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}
