package model

import (
	"fmt"
	"gorn/gorn"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	BaseModel
	Name            string `gorm:"size:255"`
	Email           string `gorm:"type:varchar(100);index:idx_email"`
	Password        string `gorm:"size:255" json:"-"`
	EmailVerifiedAt time.Time
	IsAdmin         uint8
	UserID          uint `gorm:"index"`
	GroupID         uint `gorm:"index"`
	Group           Group
}

func MakePassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func (u *User) HasPermission(route string) bool {
	pr := strings.Split(route, "/")
	access := ""
	model := pr[1]
	if pr[2] == ":id" {
		access = "update"
	} else if pr[2] == "create" {
		access = "create"
	} else if pr[2] == "index" || pr[2] == "" {
		access = "list"
	}

	p := &Permission{}
	gorn.DB.First(p, "model = ? ", model)

	if access == "create" && p.Create {
		return true
	} else if access == "edit" && p.Update {
		return true
	} else if access == "list" && p.List {
		return true
	}

	return false
}

func (u *User) BeforeSave(tx *gorm.DB) (err error) {

	if u.Password != "" {
		hash, err := MakePassword(u.Password)
		if err != nil {
			return err
		}
		tx.Statement.SetColumn("Password", hash)
	}

	return
}

func (u *User) Login(email string, password string) (string, error) {

	gorn.DB.First(u, "email = ? ", email)

	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	if err != nil {
		return "", err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": u.ID,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))

	if err == nil {
		return tokenString, nil
	}

	return "", err
}

func (u *User) Check(tokenString string) bool {
	token, _ := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("SECRET")), nil
	})

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {

		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			return false
		}
	}

	gorn.DB.First(u, claims["sub"])
	return true
}
