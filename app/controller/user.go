package controller

import (
	"fmt"
	"gorn/app/model"
	"gorn/gorn"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	BaseController
}

func (c *UserController) InitRoutes(r *gin.Engine) {
	r.GET("/login", c.Login)
	r.GET("/register", c.Register)
	r.POST("/register", c.RegisterPost)
	r.POST("/login", c.LoginPost)
	r.GET("/panel", c.Panel)
}

func (c *UserController) Panel(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1})
}

func (c *UserController) Register(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1})
}

func (c *UserController) Login(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1})
}

func (c *UserController) RegisterPost(ctx *gin.Context) {
	var body struct {
		Name     string `form:"name" binding:"required"`
		Email    string `form:"email" binding:"required,email"`
		Password string `form:"password" binding:"required"`
	}

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": err})
		return
	}

	user := &model.User{}
	check := gorn.DB.First(user, "email = ?", body.Email)

	if check.RowsAffected != 0 {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": "This user exists !"})
		return
	}

	user.Name = body.Name
	user.Email = body.Email
	user.Password = body.Password
	save := user.Save(user)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	auth, _ := user.Login(user.Email, body.Password)

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Registered successfully", "data": map[string]any{"auth": auth}})
}

func (c *UserController) LoginPost(ctx *gin.Context) {
	var body struct {
		Email    string `form:"email" binding:"required,email"`
		Password string `form:"password" binding:"required"`
	}

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("%v", err)})
		return
	}

	user := model.User{}

	auth, err := user.Login(body.Email, body.Password)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": "Fail login!"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": "Logined successfully", "data": map[string]any{"auth": auth}})
}
