package main

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
)

//func main() {
//
//	admin, _ := ioutil.ReadFile("admin/dist/index.html")
//	site, _ := ioutil.ReadFile("site/index.html")
//
//	static := gin.New()
//	static.Static("/assets", "./admin/dist/assets/")
//
//	r := gin.Default()
//	r.GET("/*site", func(ctx *gin.Context) {
//		param := ctx.Param("site")
//		paramSplit := strings.Split(param, "/")
//
//		if paramSplit[1] == "admin" {
//			ctx.Data(200, "text/html", admin)
//		} else if paramSplit[1] == "assets" {
//			static.HandleContext(ctx)
//		} else {
//			ctx.Data(200, "text/html", site)
//		}
//	})
//
//	r.Run(":8091")
//}

type (
	Group struct {
		ID          uint         `gorm:"primarykey" json:"id"`
		Title       string       `gorm:"size:255" json:"title"`
		UserId      uint         `gorm:"index" json:"userid"`
		Users       []User       `json:"users"`
		Permissions []Permission `json:"permissions"`
	}
	Permission struct {
		ID      uint   `gorm:"primarykey" json:"id"`
		UserID  uint   `json:"userid"`
		GroupID uint   `json:"groupid"`
		Model   string `json:"model"`
	}
	User struct {
		ID      uint   `gorm:"primarykey" json:"id"`
		Name    string `json:"name" gorm:"size:255"`
		Email   string `json:"email" gorm:"type:varchar(100);index:idx_email"`
		UserID  uint   `json:"userid" gorm:"index"`
		GroupID uint   `json:"groupid" gorm:"index"`
		// Groups  Group  `json:"groups"` you should not define a Group in User struct !
	}
)

func main() {
	dsn := "root:pwd@tcp(127.0.0.1:3306)/gorn?charset=utf8mb4&parseTime=True&loc=Local"

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to database: %q\n", err)
	}

	db.AutoMigrate(&Group{}, &User{}, &Permission{})

	gp1 := Group{Title: "group_example1", Users: []User{{Name: "user_example1"}, {Name: "user_example2"}}, Permissions: []Permission{{UserID: 2, GroupID: 3}}}
	gp2 := Group{Title: "group_example2", Users: []User{{Name: "user_example3"}}, Permissions: []Permission{{UserID: 12, GroupID: 4}}}
	db.Create(&gp1)
	db.Create(&gp2)

	var groups []Group
	err = db.Preload("Users").Preload("Permissions").Find(&groups).Error
	if err != nil {
		log.Fatalf("failed to query products: %q\n", err)
	}

	fmt.Println(groups)

}
