package controller

import (
	"gorn/app/model"
	"gorn/gorn"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type BaseController struct {
	gorn.Controller
	authUser *model.User
}

func (c *BaseController) parentEdit(ctx *gin.Context, model any) {
	gorn.DB.First(model, ctx.Param("id"))
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"edit": model}})
}

func (c *BaseController) Search(ctx *gin.Context, list any) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		search := ctx.Query("search")
		sql := ""
		sql = "title like ? "
		bind := []string{}
		bind = append(bind, "%"+search+"%")

		if search != "" {
			return db.Where(sql, bind)
		}
		return db
	}
}

func (c *BaseController) parentIndex(ctx *gin.Context, list any) {

	var p gorn.Paginator

	result := gorn.DB.Scopes(c.Search(ctx, &list)).Scopes(p.Paginate(ctx, &list)).Find(&list)
	if result.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": result.Error})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"list": list, "pagination": p}})
}