package controller

import (
	"fmt"
	"gorn/app/model"
	"gorn/gorn"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	BaseController
}

func newUserMethod(method string) func(*gin.Context) {
	return func(ctx *gin.Context) {
		gorn.HandleJson(ctx, &UserController{}, method)
	}
}

func (c *UserController) InitRoutes(r *gin.Engine) {
	r.GET("/login", newUserMethod("Login"))
	r.GET("/register", newUserMethod("Register"))
	r.POST("/register", newUserMethod("RegisterPost"))
	r.POST("/login", newUserMethod("LoginPost"))
	r.GET("/panel", func(ctx *gin.Context) {
		gorn.HandleJson(ctx, &UserController{}, "Panel", "Auth")
	})
}

func (c *UserController) Panel(ctx *gin.Context) any {
	return c.Flash("ok")
}

func (c *UserController) Register(ctx *gin.Context) any {
	return c.Flash("ok")
}

func (c *UserController) Login(ctx *gin.Context) any {

	return c.Flash("ok")
}

func (c *UserController) RegisterPost(ctx *gin.Context) any {
	var body struct {
		Name     string `form:"name" binding:"required"`
		Email    string `form:"email" binding:"required,email"`
		Password string `form:"password" binding:"required"`
	}

	if err := ctx.ShouldBind(&body); err != nil {
		return c.Flash(fmt.Sprintf("%v", err), 0)
	}

	user := &model.User{}
	check := gorn.DB.First(user, "email = ?", body.Email)

	if check.RowsAffected != 0 {
		return c.Flash("This user exists !", 0)
	}

	user.Name = body.Name
	user.Email = body.Email
	user.Password = body.Password
	save := user.Save(user)
	if save.Error != nil {
		return c.Flash(fmt.Sprintf("Error on save: %v", save.Error), 0)
	}

	auth, _ := user.Login(user.Email, body.Password)
	c.Set("auth", auth)
	return c.Flash("Registered successfully")
}

func (c *UserController) LoginPost(ctx *gin.Context) any {
	var body struct {
		Email    string `form:"email" binding:"required,email"`
		Password string `form:"password" binding:"required"`
	}

	if err := ctx.ShouldBind(&body); err != nil {
		return c.Flash(fmt.Sprintf("%v", err), 0)
	}

	user := model.User{}

	jwt, err := user.Login(body.Email, body.Password)
	if err != nil {
		return c.Flash("Fail login!", 0)
	}

	c.Set("jwt", jwt)
	return c.Flash("Logined successfully")
}
