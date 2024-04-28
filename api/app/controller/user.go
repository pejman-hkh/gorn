package controller

import (
	"fmt"
	"gorn/app/middle"
	"gorn/app/model"
	"gorn/gorn"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
)

type UserForm struct {
	Name    string `form:"name" binding:"required"`
	Email   string `form:"email" binding:"required,email"`
	Status  uint8  `form:"status"`
	IsAdmin bool   `form:"is_admin"`
	IsMain  bool   `form:"is_main"`
	GroupID uint   `form:"group_id"`
}

type UserController struct {
	BaseController
}

func InitUser(r *gin.RouterGroup) {
	a := &UserController{}
	a.InitRoutes(r)
}

func (c *UserController) InitRoutes(r *gin.RouterGroup) {

	g := r.Group("admin/users")
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

	g = r.Group("admin")

	g.GET("/login", c.Login)
	g.GET("/register", c.Register)
	g.POST("/register", c.RegisterPost)
	g.POST("/login", c.LoginPost)
	g.GET("/panel", c.Panel)

}

func (c *UserController) Index(ctx *gin.Context) {
	list := []model.User{}
	var p gorn.Paginator
	search := []string{"name", "email"}
	asearch := map[string]string{"name": "like", "email": "like", "statue": "=", "is_admin": "=", "is_main": "=", "group_id": "="}
	result := gorn.DB.Scopes(c.Search(ctx, &list, search)).Scopes(c.AdvancedSearch(ctx, &list, asearch)).Scopes(p.Paginate(ctx, &list)).Find(&list)

	if result.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": result.Error})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"list": list, "paginate": p}})
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
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user := &model.User{}
	check := gorn.DB.First(user, "email = ?", body.Email)

	if check.RowsAffected != 0 {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "This user exists !")})
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

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Registered successfully"), "data": map[string]any{"auth": auth}})
}

func (c *UserController) LoginPost(ctx *gin.Context) {
	var body struct {
		Email    string `form:"email" binding:"required,email"`
		Password string `form:"password" binding:"required"`
	}

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	user := model.User{}

	auth, err := user.Login(body.Email, body.Password)
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": "Fail login!"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Logined successfully"), "data": map[string]any{"auth": auth, "redirect": "/admin/dashboard"}})
}

func (c *UserController) Edit(ctx *gin.Context) {
	model := model.User{}
	c.ParentEdit(ctx, &model)
}

func (c *UserController) Update(ctx *gin.Context) {
	var body UserForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	authUser1, _ := ctx.Get("authUser")
	authUser := authUser1.(*model.User)
	user := model.User{}
	gorn.DB.First(&user, ctx.Param("id"))

	if !authUser.IsMain && user.IsMain {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "You cannot update main user!")})
		return
	}

	if !authUser.IsMain && body.IsMain {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "You cannot create main user!")})
		return
	}

	if authUser.ID == user.ID {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "You cannot update yourself!")})
		return
	}

	copier.Copy(&user, &body)
	user.UserId = authUser.ID

	save := user.Save(&user)
	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully"), "data": map[string]any{"model": user}})
}

func (c *UserController) Create(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"model": model.User{}}})
}

func (c *UserController) Store(ctx *gin.Context) {
	var body UserForm

	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	pass := ctx.PostForm("password")
	if pass == "" || len(pass) < 6 {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Password should be greater than 6 character")})
		return
	}
	if ctx.PostForm("password") != ctx.PostForm("repassword") {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Password should be same!")})
		return
	}

	user := &model.User{}
	check := gorn.DB.First(user, "email = ?", body.Email)

	if check.RowsAffected != 0 {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "This user exists !")})
		return
	}

	authUser1, _ := ctx.Get("authUser")
	authUser := authUser1.(*model.User)

	if !authUser.IsMain && body.IsMain {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "No main user could not create the main user !")})
		return
	}

	//user := &model.User{}
	copier.Copy(user, body)
	user.UserId = authUser.ID
	user.Password = ctx.PostForm("password")
	save := user.Save(user)

	if save.Error != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": fmt.Sprintf("Error on save: %v", save.Error)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Saved successfully")})
}

func (c *UserController) Destroy(ctx *gin.Context) {
	user := model.User{}
	gorn.DB.First(&user, ctx.Param("id"))
	user.Delete(&user)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}

func (c *UserController) Actions(ctx *gin.Context) {

	type Actions struct {
		Action string `form:"action" binding:"required"`
		Ids    []uint `form:"ids[]" binding:"required"`
	}
	var body Actions
	if err := ctx.ShouldBind(&body); err != nil {
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": gorn.T(ctx, "Complete required fields"), "data": err.Error()})
		return
	}

	ids := body.Ids
	user := model.User{}
	gorn.DB.Delete(&user, ids)
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "msg": gorn.T(ctx, "Deleted successfully")})
}
