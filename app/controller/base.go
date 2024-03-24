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

//this is a middleware
func (c *BaseController) Auth(ctx *gin.Context) bool {

	if c.authUser.ID == 0 {
		ctx.Redirect(http.StatusFound, "/login")
	}

	return c.authUser.ID != 0
}

func (c *BaseController) BeforeApp(ctx *gin.Context) {

}
