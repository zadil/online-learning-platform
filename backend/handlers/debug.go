package handlers

import (
	"context"
	"database/sql"
	"net/http"
	"online-learning-platform-backend/internal/db"

	"github.com/gin-gonic/gin"
)

// DebugListUsers - TEMPORAIRE: Liste tous les users pour debug
func DebugListUsers(queries *db.Queries, dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.Background()
		
		// Requête SQL directe pour lister tous les users
		rows, err := dbConn.QueryContext(ctx, "SELECT id, name, email, role, created_at FROM users")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Database query failed",
				"debug": err.Error(),
			})
			return
		}
		defer rows.Close()
		
		var users []gin.H
		for rows.Next() {
			var id int32
			var name, email, role string
			var createdAt sql.NullTime
			
			if err := rows.Scan(&id, &name, &email, &role, &createdAt); err != nil {
				continue
			}
			
			users = append(users, gin.H{
				"id":         id,
				"name":       name,
				"email":      email,
				"role":       role,
				"created_at": createdAt,
			})
		}
		
		// Compter aussi par rôle
		var adminCount, totalCount int64
		dbConn.QueryRowContext(ctx, "SELECT COUNT(*) FROM users WHERE role = 'admin'").Scan(&adminCount)
		dbConn.QueryRowContext(ctx, "SELECT COUNT(*) FROM users").Scan(&totalCount)
		
		c.JSON(http.StatusOK, gin.H{
			"users":       users,
			"total_users": totalCount,
			"admin_count": adminCount,
		})
	}
}