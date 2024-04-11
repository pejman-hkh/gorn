package controller

import (
	"fmt"
	"gorn/app/model"
	"gorn/gorn"
	"log"
	"net/http"
	"reflect"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
	"gorm.io/gorm"
)

type BaseController struct {
	gorn.Controller
	authUser *model.User
}

func getType(myvar interface{}) string {
	if t := reflect.TypeOf(myvar); t.Kind() == reflect.Ptr {
		return "*" + t.Elem().Name()
	} else {
		return t.Name()
	}
}

func (c *BaseController) makeExcel(excepts []string, data any) {
	file := excelize.NewFile()

	defer func() {
		if err := file.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	items := reflect.ValueOf(data)
	item := items.Index(0)
	v := reflect.Indirect(item)
	for i := 0; i < v.NumField(); i++ {
		if v.Field(i).Kind() != reflect.Struct {
			file.SetCellValue("Sheet1", fmt.Sprintf("%s%d", string(rune(64+i)), 1), v.Type().Field(i).Name)
		}
	}

	for i := 0; i < items.Len(); i++ {
		dataRow := i + 2
		item := items.Index(i)
		v := reflect.Indirect(item)

		if item.Kind() == reflect.Struct {
			for j := 0; j < v.NumField(); j++ {
				if v.Field(j).Kind() != reflect.Struct {
					file.SetCellValue("Sheet1", fmt.Sprintf("%s%d", string(rune(64+j)), dataRow), v.Field(j).Interface())
				}
			}
		}
	}

	model := getType(v.Interface())
	now := time.Now()
	if err := file.SaveAs("public/" + model + "-" + now.Format("2006-01-02 15:04:05") + ".xlsx"); err != nil {
		log.Fatal(err)
	}

}

func (c *BaseController) parentEdit(ctx *gin.Context, model any) {
	gorn.DB.First(model, ctx.Param("id"))
	ctx.JSON(http.StatusOK, gin.H{"status": 1, "data": map[string]any{"edit": model}})
}

func (c *BaseController) Search(ctx *gin.Context, list any, search []string) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		search := ctx.Query("search")
		sql := ""
		sql = "title like ? "
		bind := []string{}
		bind = append(bind, "%"+search+"%")

		if search != "" {
			return db.Where(sql, bind)
		}
		return db
	}
}

func (c *BaseController) AdvancedSearch(ctx *gin.Context, list any, asearch map[string]string) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {

		sql := ""
		bind := make(map[string]any)
		pre := ""
		for k, v := range asearch {
			search := ctx.Query(k)
			if search == "" {
				continue
			}

			if v == "like" {
				sql += pre + k + " like @" + k
				bind[k] = "%" + search + "%"
			} else if v == "=" {
				sql += pre + k + " = @" + k
				bind[k] = search
			}
			pre = " and "
		}

		if sql != "" {
			return db.Where(sql, bind)
		}
		return db
	}
}

func (c *BaseController) parentIndex(ctx *gin.Context, list any, search []string, asearch map[string]string) {

}
