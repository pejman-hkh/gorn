package controller

import (
	"gorn/app/model"
	"gorn/gorn"
	"net/http"

	"github.com/gin-gonic/gin"
)

type IndexController struct {
	BaseController
}

func InitIndex(r *gin.Engine) {
	index := &IndexController{}
	index.InitRoutes(r)
}

func (c *IndexController) InitRoutes(r *gin.Engine) {
	r.GET("/", c.Index)
	r.GET("/home", c.Index)

}

func (c *IndexController) Index(ctx *gin.Context) {
	users := []model.User{}
	result := gorn.DB.Find(&users)
	if result.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": result.Error})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"users": users}})
}
