package routes

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"online-learning-platform-backend/handlers"
	"online-learning-platform-backend/internal/db"
)

func RegisterUserRoutes(r *gin.Engine, queries *db.Queries, dbConn *sql.DB) {
	r.POST("/register", handlers.RegisterUserHandler(queries, dbConn))
}
