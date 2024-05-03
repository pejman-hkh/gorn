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

type PriceForm struct {
	Title     string `form:"title" binding:"required"`
	ProductId uint   `form:"product_id"`
	Status    uint8  `form:"status"`
	Price     uint   `form:"price"`
}

type PriceController struct {
	controller.BaseController
}

func InitPrice(r *gin.RouterGroup) {
	index := &PriceController{}
	index.InitRoutes(r)
}

func (c *PriceController) InitRoutes(r *gin.RouterGroup) {
	g := r.Group("admin/shop/prices")
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

func (c *PriceController) Index(ctx *gin.Context) {
	list := []shopModel.ShopPrice{}
	var p gorn.Paginator
	search := []string{"title", "url"}
	asearch := map[string]string{"title": "like", "url": "like"}
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

func (c *PriceController) Edit(ctx *gin.Context) {
	model := shopModel.ShopPrice{}
	c.ParentEdit(ctx, &model)
}

func (c *PriceController) Update(ctx *gin.Context) {
	var body PriceForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	authUser := user.(*model.User)
	price := shopModel.ShopPrice{}
	gorn.DB.First(&price, ctx.Param("id"))

	copier.Copy(&price, &body)
	price.UserId = authUser.ID

	save := price.Save(price)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully"), "data": map[string]any{"model": price}})
}

func (c *PriceController) Create(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"model": shopModel.ShopPrice{}}})
}

func (c *PriceController) Store(ctx *gin.Context) {
	var body PriceForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	authUser := user.(*model.User)

	price := &shopModel.ShopPrice{}
	copier.Copy(price, body)
	price.UserId = authUser.ID
	save := price.Save(price)
	variants := ctx.PostFormArray("variant[]")
	variantIds := ctx.PostFormArray("variant_id[]")
	for k, v := range variants {
		item := shopModel.ShopPriceItem{}
		item.Title = v
		item.VariantId = uint(gorn.Atoi(variantIds[k]))
		item.ProductId = uint(gorn.Atoi(ctx.PostForm("product_id")))
		item.PriceId = price.ID
		item.UserId = authUser.ID
		item.Save(&item)
	}

	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully")})
}

func (c *PriceController) Destroy(ctx *gin.Context) {
	price := shopModel.ShopPrice{}
	gorn.DB.First(&price, ctx.Param("id"))
	gorn.DB.Delete(&price)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}

func (c *PriceController) Actions(ctx *gin.Context) {

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
	price := shopModel.ShopPrice{}
	gorn.DB.Delete(&price, ids)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}
