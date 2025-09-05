package routes

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"online-learning-platform-backend/handlers"
	"online-learning-platform-backend/internal/db"
)

func RegisterAdminRoutes(r *gin.Engine, queries *db.Queries, dbConn *sql.DB) {
	adminHandler := handlers.NewAdminHandler(dbConn)
	
	// Routes admin normales
	admin := r.Group("/admin")
	{
		admin.GET("/dashboard-stats", adminHandler.GetDashboardStats)
		admin.GET("/teacher-requests", adminHandler.GetTeacherValidationRequests)
		admin.POST("/validate-teacher", adminHandler.ValidateTeacher)
	}
	
	// Routes admin back-office sécurisées
	backOffice := r.Group("/bo/admin")
	{
		backOffice.POST("/login", handlers.AdminLogin(queries, dbConn))
		backOffice.POST("/logout", handlers.AdminLogout(queries, dbConn))
		backOffice.GET("/security-stats", handlers.AdminSecurityStats(queries, dbConn))
		backOffice.GET("/security-logs", handlers.AdminSecurityLogs(queries, dbConn))
		backOffice.GET("/system-health", handlers.AdminSystemHealth(queries, dbConn))
	}
}