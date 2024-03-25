package middle

import (
	"gorn/app/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthRequired() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authUser := &model.User{}
		if ctx.PostForm("auth") != "" || ctx.Query("auth") != "" {
			var auth string

			auth = ctx.Query("auth")

			if auth != "" {
				authUser.Check(auth)
			}
		}

		if authUser.ID != 0 {
			ctx.Set("authUser", authUser)
			ctx.Next()
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"status": 0, "msg": "403 access denied"})
		ctx.Abort()
	}
}
