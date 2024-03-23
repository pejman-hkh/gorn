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

	authUser := &model.User{}
	if ctx.PostForm("auth") != "" || ctx.Query("auth") != "" {
		var auth string
		if ctx.Request.Method == "GET" {
			auth = ctx.Query("auth")
		} else {
			auth = ctx.PostForm("auth")
		}

		authUser.Check(auth)
	}
	c.authUser = authUser
	if authUser.ID != 0 {
		c.Set("authUser", authUser)
	}
}
