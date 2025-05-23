package routes

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"online-learning-platform-backend/handlers"
	"online-learning-platform-backend/internal/db"
)

func RegisterAuthRoutes(r *gin.Engine, queries *db.Queries, dbConn *sql.DB) {
	r.POST("/login", handlers.LoginHandler(queries, dbConn))
}
