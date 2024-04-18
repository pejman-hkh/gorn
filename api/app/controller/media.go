package controller

import (
	"fmt"
	"gorn/app/middle"
	"gorn/app/model"
	"gorn/gorn"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
)

type MediaForm struct {
	Status      uint8  `form:"status"`
	Description string `form:"description"`
}

type MediaController struct {
	BaseController
}

func InitMedia(r *gin.RouterGroup) {
	index := &MediaController{}
	index.InitRoutes(r)
}

func (c *MediaController) InitRoutes(r *gin.RouterGroup) {
	g := r.Group("admin/medias")
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

func (c *MediaController) Index(ctx *gin.Context) {
	list := []model.Media{}
	var p gorn.Paginator
	search := []string{"title", "url"}
	asearch := map[string]string{"title": "like", "url": "like", "position": "=", "status": "=", "media_id": "=", "icon": "like", "svg": "like"}
	result := gorn.DB.Preload("User").Scopes(c.Search(ctx, &list, search)).Scopes(c.AdvancedSearch(ctx, &list, asearch)).Scopes(p.Paginate(ctx, &list)).Order("Id desc").Find(&list)
	if result.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": result.Error})
		return
	}
	if ctx.Query("excel") != "" {
		c.makeExcel(ctx, []string{}, list)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"list": list, "pagination": p}})
}

func (c *MediaController) Edit(ctx *gin.Context) {
	model := model.Media{}
	c.parentEdit(ctx, &model)
}

func (c *MediaController) Update(ctx *gin.Context) {
	var body MediaForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")
	media := model.Media{}
	gorn.DB.First(&media, ctx.Param("id"))

	copier.Copy(&media, &body)
	media.UserId = user.(*model.User).ID

	save := media.Save(media)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Saved successfully", "data": map[string]any{"model": media}})
}

func (c *MediaController) Create(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"model": model.Media{}}})
}

func (c *MediaController) Store(ctx *gin.Context) {
	var body MediaForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": err.Error()})
		return
	}

	user, _ := ctx.Get("authUser")

	form, _ := ctx.MultipartForm()
	files := form.File["upload[]"]

	for _, file := range files {
		sp := strings.Split(file.Filename, ".")
		ext := sp[len(sp)-1]

		if !gorn.InArray(ext, []string{"pdf", "jpg", "jpeg", "png", "svg", "webp", "txt", "xls", "xlsx", "doc", "docx", "csv", "docb", "docm", "dot", "dotm", "dotx", "json", "zip", "rar", "pot", "potm", "potx", "ppam", "pps", "ppsm", "ppsx", "ppt", "pptm", "pptx", "xml", "html", "mp4", "mkv"}) {
			continue
		}

		media := &model.Media{}
		copier.Copy(media, body)
		media.UserId = user.(*model.User).ID
		media.File = file.Filename
		media.Size = uint(file.Size)
		save := media.Save(media)

		if save.Error != nil {
			ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
			return
		}

		ctx.SaveUploadedFile(file, "public/files/"+file.Filename)
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Saved successfully"})
}

func (c *MediaController) Destroy(ctx *gin.Context) {
	media := model.Media{}
	gorn.DB.First(&media, ctx.Param("id"))
	os.Remove("public/files/" + media.File)
	gorn.DB.Delete(&media)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Deleted successfully"})
}

func (c *MediaController) Actions(ctx *gin.Context) {

	type Actions struct {
		Action string `form:"action" binding:"required"`
		Ids    []uint `form:"ids[]" binding:"required"`
	}
	var body Actions
	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": err.Error()})
		return
	}

	ids := body.Ids
	media := model.Media{}
	list := []model.Media{}
	gorn.DB.Find(&list, ids)
	for _, media := range list {
		os.Remove("public/files/" + media.File)
	}

	gorn.DB.Delete(&media, ids)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Deleted successfully"})
}
