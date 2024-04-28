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

type VariantForm struct {
	Title      string `form:"title" binding:"required"`
	CategoryId uint   `form:"category_id"`
	Status     uint8  `form:"status"`
	Values     string `form:"values"`
	Lang       string `form:"lang"`
}

type VariantController struct {
	controller.BaseController
}

func InitVariant(r *gin.RouterGroup) {
	index := &VariantController{}
	index.InitRoutes(r)
}

func (c *VariantController) InitRoutes(r *gin.RouterGroup) {
	g := r.Group("admin/shop/variants")
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

func (c *VariantController) Index(ctx *gin.Context) {
	list := []shopModel.ShopVariant{}
	var p gorn.Paginator
	search := []string{"title", "url"}
	asearch := map[string]string{"title": "like", "url": "like"}
	result := gorn.DB.Preload("User").Scopes(c.Lang(ctx, &list)).Scopes(c.Search(ctx, &list, search)).Scopes(c.AdvancedSearch(ctx, &list, asearch)).Scopes(p.Paginate(ctx, &list)).Order("Id desc").Find(&list)
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

func (c *VariantController) Edit(ctx *gin.Context) {
	model := shopModel.ShopVariant{}
	c.ParentEdit(ctx, &model)
}

func (c *VariantController) Update(ctx *gin.Context) {
	var body VariantForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	authUser := user.(*model.User)
	variant := shopModel.ShopVariant{}
	gorn.DB.First(&variant, ctx.Param("id"))

	copier.Copy(&variant, &body)
	variant.UserId = authUser.ID

	save := variant.Save(variant)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully"), "data": map[string]any{"model": variant}})
}

func (c *VariantController) Create(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"model": shopModel.ShopVariant{}}})
}

func (c *VariantController) Store(ctx *gin.Context) {
	var body VariantForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	authUser := user.(*model.User)

	variant := &shopModel.ShopVariant{}
	copier.Copy(variant, body)
	variant.UserId = authUser.ID

	save := variant.Save(variant)

	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully")})
}

func (c *VariantController) Destroy(ctx *gin.Context) {
	variant := shopModel.ShopVariant{}
	gorn.DB.First(&variant, ctx.Param("id"))
	gorn.DB.Delete(&variant)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}

func (c *VariantController) Actions(ctx *gin.Context) {

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
	variant := shopModel.ShopVariant{}
	gorn.DB.Delete(&variant, ids)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}
