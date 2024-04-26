package controller

import (
	"gorn/app/middle"
	"gorn/app/model"
	"gorn/gorn"
	"net/http"

	"github.com/gin-gonic/gin"
)

type LogController struct {
	BaseController
}

func InitLog(r *gin.RouterGroup) {
	index := &LogController{}
	index.InitRoutes(r)
}

func (c *LogController) InitRoutes(r *gin.RouterGroup) {
	g := r.Group("admin/logs")
	g.Use(middle.IsAdmin())
	{
		g.GET("", c.Index)
		g.GET("/index", c.Index)
	}
}

func (c *LogController) Index(ctx *gin.Context) {
	list := []model.Log{}
	var p gorn.Paginator
	search := []string{"module", "url"}
	asearch := map[string]string{"module": "like", "action": "like", "item_id": "="}
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
