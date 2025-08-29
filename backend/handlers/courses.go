package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"online-learning-platform-backend/internal/db"
	"database/sql"
	"context"
	"fmt"
	"strings"
	"time"
)

type CourseResponse struct {
	ID        int32  `json:"id"`
	Title     string `json:"title"`
	Description string `json:"description"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	AuthorID  *int32 `json:"author_id"`
}

func ListCoursesHandler(queries *db.Queries, dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("[DEBUG] Début ListCoursesHandler")
		
		// Vérifier la connexion DB
		ctx := context.Background()
		fmt.Println("[DEBUG] Contexte:", ctx)
		fmt.Println("[DEBUG] Queries:", queries)
		fmt.Println("[DEBUG] DB Conn:", dbConn)
		err := dbConn.PingContext(ctx)
		if err != nil {
			fmt.Printf("[ERROR] Erreur connexion DB: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
			return
		}
		fmt.Println("[DEBUG] Connexion DB OK")
		
		// Exécuter la requête
		fmt.Println("[DEBUG] Exécution de ListCourses")
		courses, err := queries.ListCourses(ctx)
		if err != nil {
			fmt.Printf("[ERROR] Détails erreur ListCourses: %+v\n", err)
			fmt.Printf("[DEBUG] Type erreur: %T\n", err)
			fmt.Printf("[ERROR] Erreur ListCourses: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		
		fmt.Printf("[DEBUG] %d cours récupérés\n", len(courses))
		
		// Transformer les cours pour le frontend
		var response []CourseResponse
		for _, course := range courses {
			desc := ""
			if course.Description.Valid {
				desc = course.Description.String
			}

			var authorID *int32
			if course.AuthorID.Valid {
				authorID = &course.AuthorID.Int32
			}

			response = append(response, CourseResponse{
				ID:        course.ID,
				Title:     course.Title,
				Description: desc,
				CreatedAt: course.CreatedAt.Format(time.RFC3339),
				UpdatedAt: course.UpdatedAt.Format(time.RFC3339),
				AuthorID:  authorID,
			})
		}

		c.JSON(http.StatusOK, response)
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
		roleNormalized := strings.TrimSpace(strings.ToLower(role))
		if roleNormalized != "formateur" && roleNormalized != "admin" {
			fmt.Printf("[DEBUG] Refus création cours: userID=%v, role reçu='%v' (normalisé='%v')\n", userID, role, roleNormalized)
			c.JSON(http.StatusForbidden, gin.H{"error": "Seuls les formateurs ou admins peuvent créer un cours. (role reçu: " + role + ")"})
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
		fmt.Println("[DEBUG] Contexte:", ctx)
		fmt.Println("[DEBUG] Queries:", queries)
		fmt.Println("[DEBUG] DB Conn:", dbConn)
		course, err := queries.CreateCourse(ctx, db.CreateCourseParams{
			Title:       req.Title,
			Description: sql.NullString{String: req.Description, Valid: req.Description != ""},
			AuthorID:    sql.NullInt32{Int32: int32(userID), Valid: true},
		})
		if err != nil {
			fmt.Printf("[ERROR] Détails erreur CreateCourse: %+v\n", err)
			fmt.Printf("[DEBUG] Type erreur: %T\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, course)
	}
}
