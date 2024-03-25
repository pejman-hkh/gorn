package middle

import (
	"gorn/app/model"

	"github.com/gin-gonic/gin"
)

func AuthRequired() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authUser := &model.User{}
		if ctx.PostForm("auth") != "" || ctx.Query("auth") != "" {

			auth := ctx.Query("auth")

			if auth != "" {
				authUser.Check(auth)
			}
		}

		if authUser.ID != 0 {
			ctx.Set("authUser", authUser)
			if authUser.IsAdmin == 1 {
				ctx.Next()
			} else {
				route := ctx.FullPath()

				if !authUser.HasPermission(route) {
					ctx.JSON(403, gin.H{"status": 0, "msg": "403 access denied"})
					ctx.Abort()
				}
			}
			return
		}
		ctx.JSON(403, gin.H{"status": 0, "msg": "403 access denied"})
		ctx.Abort()
	}
}
