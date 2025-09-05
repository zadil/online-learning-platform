package handlers

import (
	"context"
	"database/sql"
	"net/http"
	"strconv"
	"time"
	"github.com/gin-gonic/gin"
	"online-learning-platform-backend/models"
)

type AdminHandler struct {
	db *sql.DB
}

func NewAdminHandler(db *sql.DB) *AdminHandler {
	return &AdminHandler{db: db}
}

// GetTeacherValidationRequests récupère les demandes de validation d'enseignants
func (h *AdminHandler) GetTeacherValidationRequests(c *gin.Context) {
	var requests []models.TeacherValidationRequest
	
	err := h.db.Preload("Teacher").Preload("RequestedByUser").
		Where("status = ?", "pending_review").
		Find(&requests).Error
		
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des demandes"})
		return
	}
	
	c.JSON(http.StatusOK, requests)
}

// ValidateTeacher valide un enseignant
func (h *AdminHandler) ValidateTeacher(c *gin.Context) {
	var req struct {
		TeacherID uint   `json:"teacher_id" binding:"required"`
		Comments  string `json:"comments"`
		Approve   bool   `json:"approve" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	user, _ := c.Get("user")
	adminUser := user.(*models.User)
	
	// Commencer une transaction
	tx := h.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()
	
	// Mettre à jour le statut de l'enseignant
	var teacher models.User
	if err := tx.First(&teacher, req.TeacherID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "Enseignant non trouvé"})
		return
	}
	
	if req.Approve {
		teacher.Status = models.StatusValidated
		teacher.ValidatedBy = &adminUser.ID
		now := time.Now()
		teacher.ValidatedAt = &now
		
		// Assigner les permissions d'enseignant
		teacher.Permissions = models.GetDefaultPermissions(models.RoleTeacher)
	} else {
		teacher.Status = models.StatusSuspended
	}
	
	if err := tx.Save(&teacher).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la validation"})
		return
	}
	
	// Mettre à jour la demande de validation
	var validationRequest models.TeacherValidationRequest
	err := tx.Where("teacher_id = ? AND status = ?", req.TeacherID, "pending_review").
		First(&validationRequest).Error
		
	if err == nil {
		validationRequest.ReviewedBy = &adminUser.ID
		validationRequest.Status = map[bool]string{true: "approved", false: "rejected"}[req.Approve]
		validationRequest.Comments = req.Comments
		now := time.Now()
		validationRequest.ReviewDate = &now
		
		tx.Save(&validationRequest)
	}
	
	tx.Commit()
	
	message := "Enseignant validé avec succès"
	if !req.Approve {
		message = "Demande d'enseignant rejetée"
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message": message,
		"teacher": teacher,
	})
}

// GetDashboardStats retourne les statistiques du tableau de bord admin
func (h *AdminHandler) GetDashboardStats(c *gin.Context) {
	var stats struct {
		TotalStudents           int `json:"total_students"`
		TotalTeachers           int `json:"total_teachers"`
		ValidatedTeachers       int `json:"validated_teachers"`
		PendingTeacherRequests  int `json:"pending_teacher_requests"`
		TotalCourses           int `json:"total_courses"`
		CoursesNeedingTeacher  int `json:"courses_needing_teacher"`
	}
	
	// Utiliser SQL direct au lieu de GORM pour les statistiques
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

// GetAllUsers retourne tous les utilisateurs (admin seulement)
func (h *AdminHandler) GetAllUsers(c *gin.Context) {
	var users []models.User
	
	// Paramètres de pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	role := c.Query("role")
	status := c.Query("status")
	
	offset := (page - 1) * limit
	
	query := h.db.Omit("password")
	
	if role != "" {
		query = query.Where("role = ?", role)
	}
	
	if status != "" {
		query = query.Where("status = ?", status)
	}
	
	var total int64
	query.Model(&models.User{}).Count(&total)
	
	err := query.Limit(limit).Offset(offset).Find(&users).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des utilisateurs"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"users": users,
		"pagination": gin.H{
			"page":  page,
			"limit": limit,
			"total": total,
		},
	})
}

// UpdateUserRole met à jour le rôle d'un utilisateur
func (h *AdminHandler) UpdateUserRole(c *gin.Context) {
	userID := c.Param("id")
	
	var req struct {
		Role   string `json:"role" binding:"required,oneof=admin secretariat teacher student"`
		Status string `json:"status" binding:"omitempty,oneof=active pending_validation validated suspended inactive"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Utilisateur non trouvé"})
		return
	}
	
	// Mettre à jour le rôle et les permissions
	user.Role = req.Role
	user.Permissions = models.GetDefaultPermissions(req.Role)
	
	if req.Status != "" {
		user.Status = req.Status
	}
	
	if err := h.db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la mise à jour"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message": "Utilisateur mis à jour avec succès",
		"user": user,
	})
}