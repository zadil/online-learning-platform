package routes

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"online-learning-platform-backend/handlers"
	"online-learning-platform-backend/internal/db"
)

func RegisterAdminRoutes(r *gin.Engine, queries *db.Queries, dbConn *sql.DB) {
	adminHandler := handlers.NewAdminHandler(dbConn)
	
	admin := r.Group("/admin")
	{
		admin.GET("/dashboard-stats", adminHandler.GetDashboardStats)
		admin.GET("/teacher-requests", adminHandler.GetTeacherValidationRequests)
		admin.POST("/validate-teacher", adminHandler.ValidateTeacher)
	}
}