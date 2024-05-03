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
	shopController.InitParamCategory(g)
	shopController.InitParamQuestion(g)
	shopController.InitParamAnswer(g)
	shopController.InitPrice(g)
}

func Migirations() {
	gorn.DB.AutoMigrate(shopModel.ShopCategory{})
	gorn.DB.AutoMigrate(shopModel.ShopVariant{})
	gorn.DB.AutoMigrate(shopModel.ShopProduct{})
	gorn.DB.AutoMigrate(shopModel.ShopParamCategory{})
	gorn.DB.AutoMigrate(shopModel.ShopParamQuestion{})
	gorn.DB.AutoMigrate(shopModel.ShopParamAnswer{})
	gorn.DB.AutoMigrate(shopModel.ShopParam{})
	gorn.DB.AutoMigrate(shopModel.ShopPrice{})
	gorn.DB.AutoMigrate(shopModel.ShopPriceItem{})
}
