package post

import (
	postController "gorn/app/post/controller"
	postModel "gorn/app/post/model"
	"gorn/gorn"

	"github.com/gin-gonic/gin"
)

func Init(g *gin.RouterGroup) {
	postController.InitCategory(g)
	postController.InitType(g)
	postController.InitPost(g)
}

func Migirations() {
	gorn.DB.AutoMigrate(postModel.PostCategory{})
	gorn.DB.AutoMigrate(postModel.PostType{})
	gorn.DB.AutoMigrate(postModel.PostPost{})
}
