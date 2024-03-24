package gorn

import (
	"fmt"
	"reflect"

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

	DB, _ = gorm.Open(mysql.Open(dsn), &gorm.Config{})

	// sqlDB, _ := DB.DB()
	// sqlDB.SetMaxIdleConns(10)
	// sqlDB.SetMaxOpenConns(100)
	// sqlDB.SetConnMaxLifetime(time.Hour)
}

func Invoke(obj any, name string, args ...any) []reflect.Value {
	inputs := make([]reflect.Value, len(args))
	for i, _ := range args {
		inputs[i] = reflect.ValueOf(args[i])
	}

	return reflect.ValueOf(obj).MethodByName(name).Call(inputs)
}

type Routes struct {
}
