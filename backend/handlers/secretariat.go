package handlers

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type SecretariatHandler struct {
	db *sql.DB
}

func NewSecretariatHandler(db *sql.DB) *SecretariatHandler {
	return &SecretariatHandler{db: db}
}

// GetTasks récupère les tâches du secrétariat
func (h *SecretariatHandler) GetTasks(c *gin.Context) {
	// TODO: Implémenter quand la table secretariat_tasks sera créée
	// Pour l'instant, retourner des tâches mockées
	mockTasks := []gin.H{
		{
			"id":          1,
			"title":       "Vérifier inscriptions étudiants",
			"description": "Valider les documents d'inscription",
			"priority":    "high",
			"due_date":    "2024-01-20T17:00:00Z",
			"status":      "pending",
			"created_at":  "2024-01-15T09:00:00Z",
		},
		{
			"id":          2,
			"title":       "Préparer planning examens",
			"description": "Organiser les créneaux d'examens",
			"priority":    "medium",
			"due_date":    "2024-01-25T12:00:00Z",
			"status":      "in_progress",
			"created_at":  "2024-01-16T10:30:00Z",
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"tasks": mockTasks,
		"total": len(mockTasks),
	})
}

// GetStats retourne les statistiques du secrétariat
func (h *SecretariatHandler) GetStats(c *gin.Context) {
	// Statistiques pour le dashboard secrétariat
	stats := struct {
		PendingEnrollments     int `json:"pending_enrollments"`
		PendingTeacherRequests int `json:"pending_teacher_requests"`
		UnresolvedConflicts    int `json:"unresolved_conflicts"`
		DocumentsToCheck       int `json:"documents_to_check"`
		TasksToday             int `json:"tasks_today"`
		HighPriorityTasks      int `json:"high_priority_tasks"`
	}{}

	// Pour l'instant, utiliser des valeurs mockées car les tables n'existent pas encore
	// TODO: Implémenter les vraies requêtes quand les tables seront créées

	stats.PendingEnrollments = 5     // Inscriptions en attente
	stats.PendingTeacherRequests = 3 // Demandes d'enseignants en attente
	stats.UnresolvedConflicts = 2    // Conflits d'horaires non résolus
	stats.DocumentsToCheck = 8       // Documents à vérifier
	stats.TasksToday = 4             // Tâches pour aujourd'hui
	stats.HighPriorityTasks = 2      // Tâches prioritaires

	c.JSON(http.StatusOK, stats)
}

// GetPendingStudents retourne les étudiants en attente de validation
func (h *SecretariatHandler) GetPendingStudents(c *gin.Context) {
	// TODO: Implémenter quand la table student_enrollment_requests sera créée
	// Pour l'instant, retourner des données mockées
	mockStudents := []gin.H{
		{
			"id":         1,
			"name":       "Jean Dupont",
			"email":      "jean.dupont@example.com",
			"status":     "pending_review",
			"created_at": "2024-01-15T14:20:00Z",
			"documents":  []string{"carte_identite.pdf", "diplome_bac.pdf"},
		},
		{
			"id":         2,
			"name":       "Sophie Martin",
			"email":      "sophie.martin@example.com",
			"status":     "pending_review",
			"created_at": "2024-01-16T09:15:00Z",
			"documents":  []string{"carte_identite.pdf", "relevé_notes.pdf"},
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"students": mockStudents,
		"total":    len(mockStudents),
	})
}