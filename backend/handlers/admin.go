package handlers

import (
	"context"
	"database/sql"
	"net/http"
	"online-learning-platform-backend/models"

	"github.com/gin-gonic/gin"
)

type AdminHandler struct {
	db *sql.DB
}

func NewAdminHandler(db *sql.DB) *AdminHandler {
	return &AdminHandler{db: db}
}

// GetDashboardStats retourne les statistiques pour le dashboard admin
func (h *AdminHandler) GetDashboardStats(c *gin.Context) {
	// Statistiques de base pour le dashboard admin
	stats := struct {
		TotalStudents          int `json:"total_students"`
		TotalTeachers          int `json:"total_teachers"`
		ValidatedTeachers      int `json:"validated_teachers"`
		PendingTeacherRequests int `json:"pending_teacher_requests"`
		TotalCourses           int `json:"total_courses"`
		CoursesNeedingTeacher  int `json:"courses_needing_teacher"`
	}{}

	// Utiliser SQL direct pour les statistiques
	ctx := context.Background()

	// Compter les étudiants
	var totalStudents int64
	err := h.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM users WHERE role = $1", models.RoleStudent).Scan(&totalStudents)
	if err != nil {
		totalStudents = 0
	}
	stats.TotalStudents = int(totalStudents)

	// Compter les enseignants
	var totalTeachers int64
	err = h.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM users WHERE role = $1", models.RoleTeacher).Scan(&totalTeachers)
	if err != nil {
		totalTeachers = 0
	}
	stats.TotalTeachers = int(totalTeachers)

	// Compter les enseignants validés (simulation - ajustez selon votre schéma)
	var validatedTeachers int64
	err = h.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM users WHERE role = $1", models.RoleTeacher).Scan(&validatedTeachers)
	if err != nil {
		validatedTeachers = 0
	}
	stats.ValidatedTeachers = int(validatedTeachers)

	// Pour l'instant, valeurs mockées pour les statistiques non implémentées
	stats.PendingTeacherRequests = 3

	// Compter les cours
	var totalCourses int64
	err = h.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM courses").Scan(&totalCourses)
	if err != nil {
		totalCourses = 0
	}
	stats.TotalCourses = int(totalCourses)

	// Pour l'instant, valeur mockée
	stats.CoursesNeedingTeacher = 2

	c.JSON(http.StatusOK, stats)
}

// GetTeacherValidationRequests - Version simplifiée sans GORM
func (h *AdminHandler) GetTeacherValidationRequests(c *gin.Context) {
	// TODO: Implémenter quand la table teacher_validation_requests sera créée
	// Pour l'instant, retourner des données mockées
	mockRequests := []gin.H{
		{
			"id":          1,
			"teacher_id":  1,
			"status":      "pending_review",
			"created_at":  "2024-01-15T10:00:00Z",
			"teacher": gin.H{
				"name":  "Marie Dubois",
				"email": "marie.dubois@example.com",
			},
		},
		{
			"id":          2,
			"teacher_id":  2,
			"status":      "pending_review",
			"created_at":  "2024-01-16T14:30:00Z",
			"teacher": gin.H{
				"name":  "Pierre Martin",
				"email": "pierre.martin@example.com",
			},
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"requests": mockRequests,
		"total":    len(mockRequests),
	})
}

// ValidateTeacher - Version simplifiée
func (h *AdminHandler) ValidateTeacher(c *gin.Context) {
	// TODO: Implémenter la vraie validation quand les tables seront prêtes
	c.JSON(http.StatusOK, gin.H{
		"message": "Validation d'enseignant sera implémentée",
		"status":  "not_implemented",
	})
}