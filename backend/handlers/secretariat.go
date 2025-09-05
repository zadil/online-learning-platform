package handlers

import (
	"net/http"
	"strconv"
	"time"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"online-learning-platform-backend/models"
)

type SecretariatHandler struct {
	db *gorm.DB
}

func NewSecretariatHandler(db *gorm.DB) *SecretariatHandler {
	return &SecretariatHandler{db: db}
}

// GetTasks récupère les tâches du secrétariat
func (h *SecretariatHandler) GetTasks(c *gin.Context) {
	var tasks []models.SecretariatTask
	
	user, _ := c.Get("user")
	currentUser := user.(*models.User)
	
	query := h.db.Preload("AssignedUser").Preload("CreatedByUser")
	
	// Si ce n'est pas un admin, ne montrer que les tâches assignées à l'utilisateur
	if !currentUser.IsAdmin() {
		query = query.Where("assigned_to = ?", currentUser.ID)
	}
	
	status := c.Query("status")
	if status != "" {
		query = query.Where("status = ?", status)
	}
	
	priority := c.Query("priority")
	if priority != "" {
		query = query.Where("priority = ?", priority)
	}
	
	err := query.Order("priority DESC, created_at ASC").Find(&tasks).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des tâches"})
		return
	}
	
	c.JSON(http.StatusOK, tasks)
}

// CreateTask crée une nouvelle tâche
func (h *SecretariatHandler) CreateTask(c *gin.Context) {
	var req struct {
		Type        string    `json:"type" binding:"required"`
		Title       string    `json:"title" binding:"required"`
		Description string    `json:"description"`
		Priority    string    `json:"priority" binding:"omitempty,oneof=high medium low"`
		AssignedTo  uint      `json:"assigned_to" binding:"required"`
		DueDate     time.Time `json:"due_date"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	user, _ := c.Get("user")
	currentUser := user.(*models.User)
	
	task := models.SecretariatTask{
		Type:        req.Type,
		Title:       req.Title,
		Description: req.Description,
		Priority:    req.Priority,
		AssignedTo:  req.AssignedTo,
		CreatedBy:   currentUser.ID,
		DueDate:     req.DueDate,
		Status:      models.TaskStatusPending,
	}
	
	if task.Priority == "" {
		task.Priority = models.PriorityMedium
	}
	
	if err := h.db.Create(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la création de la tâche"})
		return
	}
	
	c.JSON(http.StatusCreated, gin.H{
		"message": "Tâche créée avec succès",
		"task": task,
	})
}

// UpdateTaskStatus met à jour le statut d'une tâche
func (h *SecretariatHandler) UpdateTaskStatus(c *gin.Context) {
	taskID := c.Param("id")
	
	var req struct {
		Status string `json:"status" binding:"required,oneof=pending in_progress completed cancelled"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	var task models.SecretariatTask
	if err := h.db.First(&task, taskID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tâche non trouvée"})
		return
	}
	
	task.Status = req.Status
	if req.Status == models.TaskStatusCompleted {
		now := time.Now()
		task.CompletedAt = &now
	}
	
	if err := h.db.Save(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la mise à jour"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message": "Tâche mise à jour avec succès",
		"task": task,
	})
}

// GetPendingStudentEnrollments récupère les inscriptions d'étudiants en attente
func (h *SecretariatHandler) GetPendingStudentEnrollments(c *gin.Context) {
	var enrollments []models.StudentEnrollmentRequest
	
	err := h.db.Where("status = ?", "pending_review").
		Order("created_at ASC").
		Find(&enrollments).Error
		
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des inscriptions"})
		return
	}
	
	c.JSON(http.StatusOK, enrollments)
}

// ProcessStudentEnrollment traite une demande d'inscription d'étudiant
func (h *SecretariatHandler) ProcessStudentEnrollment(c *gin.Context) {
	enrollmentID := c.Param("id")
	
	var req struct {
		Approve  bool   `json:"approve" binding:"required"`
		Comments string `json:"comments"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	user, _ := c.Get("user")
	currentUser := user.(*models.User)
	
	var enrollment models.StudentEnrollmentRequest
	if err := h.db.First(&enrollment, enrollmentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Demande d'inscription non trouvée"})
		return
	}
	
	tx := h.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()
	
	if req.Approve {
		// Créer le compte étudiant
		student := models.User{
			Name:          enrollment.StudentName,
			Email:         enrollment.StudentEmail,
			Role:          models.RoleStudent,
			Status:        models.StatusActive,
			Permissions:   models.GetDefaultPermissions(models.RoleStudent),
			Class:         &enrollment.RequestedClass,
			ParentContact: &enrollment.ParentContact,
			// TODO: Générer un mot de passe temporaire et l'envoyer par email
			Password:      "temporary_password_hash", // À remplacer par un hash sécurisé
		}
		
		if err := tx.Create(&student).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la création du compte étudiant"})
			return
		}
		
		enrollment.StudentID = &student.ID
		enrollment.Status = "approved"
	} else {
		enrollment.Status = "rejected"
	}
	
	enrollment.ProcessedBy = &currentUser.ID
	now := time.Now()
	enrollment.ProcessedAt = &now
	
	if err := tx.Save(&enrollment).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la mise à jour de la demande"})
		return
	}
	
	tx.Commit()
	
	message := "Inscription approuvée et compte créé"
	if !req.Approve {
		message = "Inscription rejetée"
	}
	
	c.JSON(http.StatusOK, gin.H{
		"message": message,
		"enrollment": enrollment,
	})
}

// GetDashboardStats retourne les statistiques pour le tableau de bord secrétariat
func (h *SecretariatHandler) GetDashboardStats(c *gin.Context) {
	var stats models.SecretariatStats
	
	// Pour l'instant, utiliser des valeurs mockées car les tables n'existent pas encore
	// TODO: Implémenter les vraies requêtes quand les tables seront créées
	
	stats.PendingEnrollments = 5    // Inscriptions en attente
	stats.PendingTeacherRequests = 3 // Demandes d'enseignants en attente
	stats.UnresolvedConflicts = 2   // Conflits d'horaires non résolus
	stats.DocumentsToCheck = 8      // Documents à vérifier
	
	// Tâches pour aujourd'hui
	today := time.Now()
	startOfDay := time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, today.Location())
	endOfDay := startOfDay.Add(24 * time.Hour)
	
	h.db.Model(&models.SecretariatTask{}).
		Where("due_date BETWEEN ? AND ? AND status != ?", startOfDay, endOfDay, models.TaskStatusCompleted).
		Count(&stats.TasksToday)
	
	// Tâches haute priorité non terminées
	h.db.Model(&models.SecretariatTask{}).
		Where("priority = ? AND status NOT IN ?", models.PriorityHigh, []string{models.TaskStatusCompleted, models.TaskStatusCancelled}).
		Count(&stats.HighPriorityTasks)
	
	c.JSON(http.StatusOK, stats)
}

// GetScheduleConflicts récupère les conflits d'horaires
func (h *SecretariatHandler) GetScheduleConflicts(c *gin.Context) {
	var conflicts []models.ScheduleConflict
	
	err := h.db.Preload("Schedule1").Preload("Schedule2").Preload("ResolvedByUser").
		Where("status = ?", "unresolved").
		Find(&conflicts).Error
		
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des conflits"})
		return
	}
	
	c.JSON(http.StatusOK, conflicts)
}