package shopController

import (
	"fmt"
	"gorn/app/controller"
	"gorn/app/middle"
	"gorn/app/model"
	"gorn/gorn"
	shopModel "gorn/module/shop/model"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
)

type ParamCategoryForm struct {
	Title      string `form:"title" binding:"required"`
	Name       string `form:"name" binding:"required"`
	CategoryId uint   `form:"category_id"`
}

type ParamCategoryController struct {
	controller.BaseController
}

func InitParamCategory(r *gin.RouterGroup) {
	index := &ParamCategoryController{}
	index.InitRoutes(r)
}

func (c *ParamCategoryController) InitRoutes(r *gin.RouterGroup) {
	g := r.Group("admin/shop/param/categories")
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

func (c *ParamCategoryController) Index(ctx *gin.Context) {
	list := []shopModel.ShopParamCategory{}
	var p gorn.Paginator
	search := []string{"title"}
	asearch := map[string]string{"title": "like", "category_id": "="}
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

func (c *ParamCategoryController) Edit(ctx *gin.Context) {
	model := shopModel.ShopParamCategory{}
	c.ParentEdit(ctx, &model)
}

func (c *ParamCategoryController) Update(ctx *gin.Context) {
	var body ParamCategoryForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	authUser := user.(*model.User)
	category := shopModel.ShopParamCategory{}
	gorn.DB.First(&category, ctx.Param("id"))

	copier.Copy(&category, &body)
	category.UserId = authUser.ID

	save := category.Save(category)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully"), "data": map[string]any{"model": category}})
}

func (c *ParamCategoryController) Create(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"model": shopModel.ShopParamCategory{}}})
}

func (c *ParamCategoryController) Store(ctx *gin.Context) {
	var body ParamCategoryForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	authUser := user.(*model.User)

	category := &shopModel.ShopParamCategory{}
	copier.Copy(category, body)
	category.UserId = authUser.ID

	save := category.Save(category)

	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully")})
}

func (c *ParamCategoryController) Destroy(ctx *gin.Context) {
	category := shopModel.ShopParamCategory{}
	gorn.DB.First(&category, ctx.Param("id"))
	gorn.DB.Delete(&category)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}

func (c *ParamCategoryController) Actions(ctx *gin.Context) {

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
	category := shopModel.ShopParamCategory{}
	gorn.DB.Delete(&category, ids)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}
