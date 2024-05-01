package shopController

import (
	"encoding/json"
	"fmt"
	"gorn/app/controller"
	"gorn/app/middle"
	"gorn/app/model"
	"gorn/gorn"
	shopModel "gorn/module/shop/model"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ProductForm struct {
	Title        string `form:"title" binding:"required"`
	Url          string `form:"url" binding:"required"`
	CategoryId   uint   `form:"category_id"`
	Status       uint8  `form:"status"`
	Values       string `form:"values"`
	ShortContent string `form:"short_content"`
	Content      string `form:"content"`
	Stock        uint   `form:"stock"`
}

type ProductController struct {
	controller.BaseController
}

func InitProduct(r *gin.RouterGroup) {
	index := &ProductController{}
	index.InitRoutes(r)
}

func (c *ProductController) InitRoutes(r *gin.RouterGroup) {
	g := r.Group("admin/shop/products")
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

func (c *ProductController) Index(ctx *gin.Context) {
	list := []shopModel.ShopProduct{}
	var p gorn.Paginator
	search := []string{"title", "url"}
	asearch := map[string]string{"title": "like", "url": "like"}
	result := gorn.DB.Preload("User").Preload("Params").Preload("Params.Answer").Scopes(c.Search(ctx, &list, search)).Scopes(c.AdvancedSearch(ctx, &list, asearch)).Scopes(p.Paginate(ctx, &list)).Order("Id desc").Find(&list)
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

func (c *ProductController) Edit(ctx *gin.Context) {
	model := shopModel.ShopProduct{}
	c.ParentEdit(ctx, &model)
}

func (c *ProductController) Update(ctx *gin.Context) {
	byt, _ := io.ReadAll(ctx.Request.Body)

	var body map[string]any
	if err := json.Unmarshal(byt, &body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %s", err.Error())})
		return
	}

	if body["title"] == "" || body["url"] == "" {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields")})
		return
	}

	user, _ := ctx.Get("authUser")
	authUser := user.(*model.User)
	product := shopModel.ShopProduct{}
	gorn.DB.First(&product, ctx.Param("id"))

	//copier.Copy(&product, &body)
	product.UserId = authUser.ID
	product.Title = body["title"].(string)
	product.Url = body["url"].(string)
	product.Content = body["content"].(string)
	product.ShortContent = body["short_content"].(string)
	product.CategoryId = uint(gorn.Atoi(body["category_id"]))
	product.Stock = uint(gorn.Atoi(body["stock"]))
	product.UserId = authUser.ID

	save := product.Save(product)

	product.SaveQuestions(authUser.ID, product.ID, body)

	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully"), "data": map[string]any{"model": product}})
}

func (c *ProductController) Create(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"model": shopModel.ShopProduct{}}})
}

func (c *ProductController) Store(ctx *gin.Context) {
	byt, _ := io.ReadAll(ctx.Request.Body)

	var body map[string]any
	if err := json.Unmarshal(byt, &body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %s", err.Error())})
		return
	}

	if body["title"] == "" || body["url"] == "" {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields")})
		return
	}

	user, _ := ctx.Get("authUser")
	authUser := user.(*model.User)

	product := &shopModel.ShopProduct{}
	product.Title = body["title"].(string)
	product.Url = body["url"].(string)
	product.CategoryId = uint(gorn.Atoi(body["category_id"]))
	product.Stock = uint(gorn.Atoi(body["stock"]))
	product.UserId = authUser.ID

	save := product.Save(product)
	product.SaveQuestions(authUser.ID, product.ID, body)

	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully")})
}

func (c *ProductController) Destroy(ctx *gin.Context) {
	product := shopModel.ShopProduct{}
	gorn.DB.First(&product, ctx.Param("id"))
	gorn.DB.Delete(&product)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}

func (c *ProductController) Actions(ctx *gin.Context) {

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
	product := shopModel.ShopProduct{}
	gorn.DB.Delete(&product, ids)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}
