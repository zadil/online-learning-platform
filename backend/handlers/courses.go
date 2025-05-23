package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"online-learning-platform-backend/internal/db"
	"database/sql"
	"context"
)

func ListCoursesHandler(queries *db.Queries, dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.Background()
		courses, err := queries.ListCourses(ctx)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, courses)
	}
}

func CreateCourseHandler(queries *db.Queries, dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		role := c.GetString("role")
		userIDRaw, _ := c.Get("user_id")
		var userID int
		if f, ok := userIDRaw.(float64); ok {
			userID = int(f)
		}
		if role != "formateur" && role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Seuls les formateurs ou admins peuvent créer un cours."})
			return
		}
		var req struct {
			Title       string `json:"title" binding:"required"`
			Description string `json:"description"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		ctx := context.Background()
		course, err := queries.CreateCourse(ctx, db.CreateCourseParams{
			Title:       req.Title,
			Description: sql.NullString{String: req.Description, Valid: req.Description != ""},
			AuthorID:    sql.NullInt32{Int32: int32(userID), Valid: true},
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, course)
	}
}
