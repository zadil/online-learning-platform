package handlers

import (
	"context"
	"database/sql"
	"net/http"
	"online-learning-platform-backend/internal/db"

	"github.com/gin-gonic/gin"
)

// HealthCheck - Vérification santé backend et DB
func HealthCheck(queries *db.Queries, dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.Background()
		
		// Test 1: Backend up
		result := gin.H{
			"backend": "OK",
			"timestamp": ctx.Value("timestamp"),
		}
		
		// Test 2: Database connection
		if err := dbConn.PingContext(ctx); err != nil {
			result["database"] = "ERROR: " + err.Error()
			c.JSON(http.StatusInternalServerError, result)
			return
		}
		result["database"] = "OK"
		
		// Test 3: Table users exists
		var tableExists bool
		err := dbConn.QueryRowContext(ctx, 
			"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')").Scan(&tableExists)
		if err != nil {
			result["users_table"] = "ERROR: " + err.Error()
		} else if !tableExists {
			result["users_table"] = "NOT_EXISTS"
		} else {
			result["users_table"] = "OK"
		}
		
		// Test 4: Count users
		var userCount int64
		err = dbConn.QueryRowContext(ctx, "SELECT COUNT(*) FROM users").Scan(&userCount)
		if err != nil {
			result["user_count"] = "ERROR: " + err.Error()
		} else {
			result["user_count"] = userCount
		}
		
		c.JSON(http.StatusOK, result)
	}
}