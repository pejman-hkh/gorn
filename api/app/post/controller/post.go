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

type PostForm struct {
	Title        string `form:"title" binding:"required"`
	Url          string `form:"url" binding:"required"`
	PostId       uint   `form:"post_id"`
	Status       uint8  `form:"status"`
	Content      string `form:"content"`
	ShortContent string `form:"short_content"`
	Priority     uint8  `form:"priority"`
	TypeId       uint8  `form:"type_id"`
	CategoryId   uint8  `form:"category_id"`
	Lang         string `form:"lang"`
	CommentAllow bool   `form:"comment_allow"`
}

type PostController struct {
	controller.BaseController
}

func InitPost(r *gin.RouterGroup) {
	index := &PostController{}
	index.InitRoutes(r)
}

func (c *PostController) InitRoutes(r *gin.RouterGroup) {
	g := r.Group("admin/post/posts")
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

func (c *PostController) Index(ctx *gin.Context) {
	list := []postModel.PostPost{}
	var p gorn.Paginator
	search := []string{"title", "url"}
	asearch := map[string]string{"title": "like", "url": "like", "status": "=", "post_id": "=", "type_id": "=", "category_id": "="}
	result := gorn.DB.Preload("User").Scopes(c.Lang(ctx, &list)).Preload("Category").Preload("Type").Scopes(c.Search(ctx, &list, search)).Scopes(c.AdvancedSearch(ctx, &list, asearch)).Scopes(p.Paginate(ctx, &list)).Order("Id desc").Find(&list)
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

func (c *PostController) Edit(ctx *gin.Context) {
	model := postModel.PostPost{}
	c.ParentEdit(ctx, &model)
}

func (c *PostController) Update(ctx *gin.Context) {
	var body PostForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	post := postModel.PostPost{}
	gorn.DB.First(&post, ctx.Param("id"))

	copier.Copy(&post, &body)
	post.UserId = user.(*model.User).ID

	save := post.Save(post)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully"), "data": map[string]any{"model": post}})
}

func (c *PostController) Create(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"model": postModel.PostPost{}}})
}

func (c *PostController) Store(ctx *gin.Context) {
	var body PostForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")

	post := &postModel.PostPost{}
	copier.Copy(post, body)
	post.UserId = user.(*model.User).ID

	save := post.Save(post)

	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully")})
}

func (c *PostController) Destroy(ctx *gin.Context) {
	post := postModel.PostPost{}
	gorn.DB.First(&post, ctx.Param("id"))
	post.Delete(&post)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}

func (c *PostController) Actions(ctx *gin.Context) {

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
	post := postModel.PostPost{}
	gorn.DB.Delete(&post, ids)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}
