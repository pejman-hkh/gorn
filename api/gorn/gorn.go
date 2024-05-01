package gorn

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"reflect"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gofor-little/env"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Gorn struct {
	Data map[string]map[string]string
}

var DB *gorm.DB

func (gr *Gorn) Init() {
	if err := env.Load(".env"); err != nil {
		panic(err)
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:3306)/%s?charset=utf8mb4&parseTime=True&loc=Local", env.Get("DATABASE_USER", "root"), env.Get("DATABASE_PASSWORD", ""), env.Get("DATABASE_HOST", "localhost"), env.Get("DATABASE_NAME", "gorn"))

	DB, _ = gorm.Open(mysql.Open(dsn), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})

	//DB.Set("gorm:auto_preload", true)

	// sqlDB, _ := DB.DB()
	// sqlDB.SetMaxIdleConns(10)
	// sqlDB.SetMaxOpenConns(100)
	// sqlDB.SetConnMaxLifetime(time.Hour)
}

func Atoi(str any) int {
	a, _ := strconv.Atoi(str.(string))
	return a
}

func InArray(str string, arr []string) bool {
	for _, v := range arr {
		if v == str {
			return true
		}
	}

	return false
}

var files map[string][]byte

func getFile(file string) []byte {
	files = make(map[string][]byte)
	if val, ok := files[file]; ok {
		return val
	}

	byt, _ := ioutil.ReadFile(file)
	files[file] = byt
	return byt
}

func T(ctx *gin.Context, str string) string {
	lang := "en"
	if ctx.PostForm("lang") != "" {
		lang = ctx.PostForm("lang")
	}
	byt := getFile("lang/" + lang + ".json")

	var data map[string]string
	if err := json.Unmarshal(byt, &data); err != nil {
		return str
	}

	if value, ok := data[str]; ok {
		return value
	}
	return str
}

func Invoke(obj any, name string, args ...any) []reflect.Value {
	inputs := make([]reflect.Value, len(args))
	for i, _ := range args {
		inputs[i] = reflect.ValueOf(args[i])
	}

	return reflect.ValueOf(obj).MethodByName(name).Call(inputs)
}
