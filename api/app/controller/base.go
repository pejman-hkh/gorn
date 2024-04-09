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

func (c *BaseController) Search(ctx *gin.Context, list any, search []string) func(db *gorm.DB) *gorm.DB {
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

func (c *BaseController) AdvancedSearch(ctx *gin.Context, list any, asearch map[string]string) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {

		sql := ""
		bind := make(map[string]any)
		pre := ""
		for k, v := range asearch {
			search := ctx.Query(k)
			if search == "" {
				continue
			}

			if v == "like" {
				sql += pre + k + " like @" + k
				bind[k] = "%" + search + "%"
			} else if v == "=" {
				sql += pre + k + " = @" + k
				bind[k] = search
			}
			pre = " and "
		}

		if sql != "" {
			return db.Where(sql, bind)
		}
		return db
	}
}

func (c *BaseController) parentIndex(ctx *gin.Context, list any, search []string, asearch map[string]string) {

}
