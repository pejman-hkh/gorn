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

type ParamAnswerForm struct {
	Title      string `form:"title" binding:"required"`
	QuestionId uint   `form:"question_id"`
}

type ParamAnswerController struct {
	controller.BaseController
}

func InitParamAnswer(r *gin.RouterGroup) {
	index := &ParamAnswerController{}
	index.InitRoutes(r)
}

func (c *ParamAnswerController) InitRoutes(r *gin.RouterGroup) {
	g := r.Group("admin/shop/param/answers")
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

func (c *ParamAnswerController) Index(ctx *gin.Context) {
	list := []shopModel.ShopParamAnswer{}
	var p gorn.Paginator
	search := []string{"title"}
	asearch := map[string]string{"title": "like"}
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

func (c *ParamAnswerController) Edit(ctx *gin.Context) {
	model := shopModel.ShopParamAnswer{}
	c.ParentEdit(ctx, &model)
}

func (c *ParamAnswerController) Update(ctx *gin.Context) {
	var body ParamAnswerForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	authUser := user.(*model.User)
	answer := shopModel.ShopParamAnswer{}
	gorn.DB.First(&answer, ctx.Param("id"))

	copier.Copy(&answer, &body)
	answer.UserId = authUser.ID

	save := answer.Save(answer)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully"), "data": map[string]any{"model": answer}})
}

func (c *ParamAnswerController) Create(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"model": shopModel.ShopParamAnswer{}}})
}

func (c *ParamAnswerController) Store(ctx *gin.Context) {
	var body ParamAnswerForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	authUser := user.(*model.User)

	answer := &shopModel.ShopParamAnswer{}
	copier.Copy(answer, body)
	answer.UserId = authUser.ID

	save := answer.Save(answer)

	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully")})
}

func (c *ParamAnswerController) Destroy(ctx *gin.Context) {
	answer := shopModel.ShopParamAnswer{}
	gorn.DB.First(&answer, ctx.Param("id"))
	gorn.DB.Delete(&answer)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}

func (c *ParamAnswerController) Actions(ctx *gin.Context) {

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
	answer := shopModel.ShopParamAnswer{}
	gorn.DB.Delete(&answer, ids)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}
