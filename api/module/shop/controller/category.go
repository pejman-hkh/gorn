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

type CategoryForm struct {
	Title       string `form:"title" binding:"required"`
	Url         string `form:"url" binding:"required"`
	CategoryId  uint   `form:"category_id"`
	Status      uint8  `form:"status"`
	Description string `form:"description"`
	Priority    uint8  `form:"priority"`
}

type CategoryController struct {
	controller.BaseController
}

func InitCategory(r *gin.RouterGroup) {
	index := &CategoryController{}
	index.InitRoutes(r)
}

func (c *CategoryController) InitRoutes(r *gin.RouterGroup) {
	g := r.Group("admin/shop/categories")
	g.Use(middle.IsAdmin())
	{
		g.GET("", c.Index)
		g.GET("/index", c.Index)
		g.GET("/param", c.Param)
		g.GET("/create", c.Create)
		g.POST("/create", c.Store)
		g.GET("/:id/edit", c.Edit)
		g.POST("/:id", c.Update)
		g.DELETE("/:id", c.Destroy)
		g.POST("/actions", c.Actions)
	}
}

func (c *CategoryController) Param(ctx *gin.Context) {
	category := shopModel.ShopCategory{}
	categories := []shopModel.ShopParamCategory{}
	gorn.DB.Where("id = ? ", ctx.Query("id")).Order("Id desc").First(&category)
	gorn.DB.Preload("Questions").Preload("Questions.Answers").Where("category_id = ? ", category.ID).Order("Id desc").Find(&categories)

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"data": category, "categories": categories}})
}

func (c *CategoryController) Index(ctx *gin.Context) {
	list := []shopModel.ShopCategory{}
	var p gorn.Paginator
	search := []string{"title", "url"}
	asearch := map[string]string{"title": "like", "url": "like"}
	result := gorn.DB.Preload("User").Preload("Variants").Scopes(c.Search(ctx, &list, search)).Scopes(c.AdvancedSearch(ctx, &list, asearch)).Scopes(p.Paginate(ctx, &list)).Order("Id desc").Find(&list)
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

func (c *CategoryController) Edit(ctx *gin.Context) {
	model := shopModel.ShopCategory{}
	c.ParentEdit(ctx, &model)
}

func (c *CategoryController) Update(ctx *gin.Context) {
	var body CategoryForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	authUser := user.(*model.User)
	category := shopModel.ShopCategory{}
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

func (c *CategoryController) Create(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"model": shopModel.ShopCategory{}}})
}

func (c *CategoryController) Store(ctx *gin.Context) {
	var body CategoryForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	authUser := user.(*model.User)

	category := &shopModel.ShopCategory{}
	copier.Copy(category, body)
	category.UserId = authUser.ID

	save := category.Save(category)

	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully")})
}

func (c *CategoryController) Destroy(ctx *gin.Context) {
	category := shopModel.ShopCategory{}
	gorn.DB.First(&category, ctx.Param("id"))
	gorn.DB.Delete(&category)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}

func (c *CategoryController) Actions(ctx *gin.Context) {

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
	category := shopModel.ShopCategory{}
	gorn.DB.Delete(&category, ids)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}
