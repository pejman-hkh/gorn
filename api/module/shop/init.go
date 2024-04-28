package shop

import (
	"gorn/gorn"
	shopController "gorn/module/shop/controller"
	shopModel "gorn/module/shop/model"

	"github.com/gin-gonic/gin"
)

func Init(g *gin.RouterGroup) {
	shopController.InitCategory(g)
	shopController.InitVariant(g)
	shopController.InitProduct(g)
}

func Migirations() {
	gorn.DB.AutoMigrate(shopModel.ShopCategory{})
	gorn.DB.AutoMigrate(shopModel.ShopVariant{})
	gorn.DB.AutoMigrate(shopModel.ShopProduct{})
}
