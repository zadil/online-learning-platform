package routes

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"online-learning-platform-backend/handlers"
	"online-learning-platform-backend/internal/db"
)

func RegisterBootstrapRoutes(r *gin.Engine, queries *db.Queries, dbConn *sql.DB) {
	// Groupe de routes bootstrap
	bootstrap := r.Group("/bo/setup")
	{
		bootstrap.GET("/bootstrap", handlers.CheckBootstrapAvailability(queries, dbConn))
		bootstrap.POST("/create-admin", handlers.CreateFirstAdmin(queries, dbConn))
	}
	
	// Route debug temporaire
	r.GET("/debug/users", handlers.DebugListUsers(queries, dbConn))
}