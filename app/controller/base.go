package controller

import (
	"gorn/app/model"
	"gorn/gorn"
	"net/http"

	"github.com/gin-gonic/gin"
)

type BaseController struct {
	gorn.Controller
	authUser *model.User
}

func (c *BaseController) parentEdit(ctx *gin.Context, model any) {
	gorn.DB.First(model, ctx.Param("id"))
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"edit": model}})
}

func (c *BaseController) parentIndex(ctx *gin.Context, list any) {

	var p gorn.Paginator

	result := gorn.DB.Scopes(p.Paginate(ctx, &list)).Find(&list)
	if result.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": result.Error})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"list": list, "paginate": p}})
}
