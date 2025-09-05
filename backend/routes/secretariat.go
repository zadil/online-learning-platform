package routes

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"online-learning-platform-backend/handlers"
	"online-learning-platform-backend/internal/db"
)

func RegisterSecretariatRoutes(r *gin.Engine, queries *db.Queries, dbConn *sql.DB) {
	secretariatHandler := handlers.NewSecretariatHandler(dbConn)
	
	secretariat := r.Group("/secretariat")
	{
		secretariat.GET("/tasks", secretariatHandler.GetTasks)
		secretariat.GET("/stats", secretariatHandler.GetStats)
		secretariat.GET("/students/pending", secretariatHandler.GetPendingStudents)
	}
}