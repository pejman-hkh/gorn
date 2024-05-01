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

type ParamQuestionForm struct {
	Title      string `form:"title" binding:"required"`
	CategoryId uint   `form:"category_id"`
}

type ParamQuestionController struct {
	controller.BaseController
}

func InitParamQuestion(r *gin.RouterGroup) {
	index := &ParamQuestionController{}
	index.InitRoutes(r)
}

func (c *ParamQuestionController) InitRoutes(r *gin.RouterGroup) {
	g := r.Group("admin/shop/param/questions")
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

func (c *ParamQuestionController) Index(ctx *gin.Context) {
	list := []shopModel.ShopParamQuestion{}
	var p gorn.Paginator
	search := []string{"title"}
	asearch := map[string]string{"title": "like", "category_id": "="}
	result := gorn.DB.Preload("User").Preload("Answers").Scopes(c.Search(ctx, &list, search)).Scopes(c.AdvancedSearch(ctx, &list, asearch)).Scopes(p.Paginate(ctx, &list)).Order("Id desc").Find(&list)
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

func (c *ParamQuestionController) Edit(ctx *gin.Context) {
	model := shopModel.ShopParamQuestion{}
	c.ParentEdit(ctx, &model)
}

func (c *ParamQuestionController) Update(ctx *gin.Context) {
	var body ParamQuestionForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	authUser := user.(*model.User)
	question := shopModel.ShopParamQuestion{}
	gorn.DB.First(&question, ctx.Param("id"))

	copier.Copy(&question, &body)
	question.UserId = authUser.ID

	save := question.Save(question)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully"), "data": map[string]any{"model": question}})
}

func (c *ParamQuestionController) Create(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"model": shopModel.ShopParamQuestion{}}})
}

func (c *ParamQuestionController) Store(ctx *gin.Context) {
	var body ParamQuestionForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	authUser := user.(*model.User)

	question := &shopModel.ShopParamQuestion{}
	copier.Copy(question, body)
	question.UserId = authUser.ID

	save := question.Save(question)

	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully")})
}

func (c *ParamQuestionController) Destroy(ctx *gin.Context) {
	question := shopModel.ShopParamQuestion{}
	gorn.DB.First(&question, ctx.Param("id"))
	gorn.DB.Delete(&question)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}

func (c *ParamQuestionController) Actions(ctx *gin.Context) {

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
	question := shopModel.ShopParamQuestion{}
	gorn.DB.Delete(&question, ids)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}
