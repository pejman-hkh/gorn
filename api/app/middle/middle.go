package middle

import (
	"gorn/app/model"

	"github.com/gin-gonic/gin"
)

func AccessDenied(ctx *gin.Context) {
	ctx.JSON(403, gin.H{"status": 0, "msg": "403 access denied"})
	ctx.Abort()
}

func Cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()

	}
}

func IsAdmin() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		if !Authenticate(ctx) {
			AccessDenied(ctx)
			return
		}

		if get, ok := ctx.Get("authUser"); ok {
			authUser := get.(*model.User)

			if !authUser.IsAdmin {
				AccessDenied(ctx)
				return
			}

			if !authUser.IsMain {

				if !authUser.HasPermission(ctx) {
					AccessDenied(ctx)
					return
				}
			}

		} else {
			AccessDenied(ctx)
		}

	}

}

func Authenticate(ctx *gin.Context) bool {
	authUser := &model.User{}
	if ctx.PostForm("auth") != "" || ctx.Query("auth") != "" {

		auth := ctx.Query("auth")

		if auth != "" {
			authUser.Check(auth)
		}
	}

	if authUser.ID == 0 {
		return false
	}

	ctx.Set("authUser", authUser)
	return true
}

func AuthRequired() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if !Authenticate(ctx) {
			AccessDenied(ctx)
			return
		}
		ctx.Next()
	}
}
