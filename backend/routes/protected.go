package routes

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"online-learning-platform-backend/middleware"
)

func RegisterProtectedRoutes(r *gin.Engine, dbConn *sql.DB) {
	group := r.Group("/protected")
	group.Use(middleware.AuthRequired())
	group.GET("/me", func(c *gin.Context) {
		userIDRaw, _ := c.Get("user_id")
		email := c.GetString("email")
		role := c.GetString("role")
		var userID int
		if f, ok := userIDRaw.(float64); ok {
			userID = int(f)
		}

		// Aller chercher l'utilisateur en base pour created_at
		var createdAt string
		if dbConn != nil && userID > 0 {
			row := dbConn.QueryRow("SELECT created_at FROM users WHERE id = $1", userID)
			_ = row.Scan(&createdAt)
		}

		c.JSON(200, gin.H{
			"user_id": userID,
			"email": email,
			"role": role,
			"created_at": createdAt,
		})
	})
}
