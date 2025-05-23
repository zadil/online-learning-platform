package routes

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"online-learning-platform-backend/handlers"
	"online-learning-platform-backend/internal/db"
)

func RegisterCoursesRoutes(r *gin.Engine, queries *db.Queries, dbConn *sql.DB) {
	r.GET("/courses", handlers.ListCoursesHandler(queries, dbConn))
	r.POST("/courses", handlers.CreateCourseHandler(queries, dbConn)) // nécessite authentification JWT
}
