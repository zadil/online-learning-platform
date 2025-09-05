package models

import (
	"gorm.io/gorm"
	"time"
)

// Modèles pour faciliter le travail du secrétariat

// Énumération des types de tâches
const (
	TaskTypeStudentEnrollment = "student_enrollment"
	TaskTypeTeacherValidation = "teacher_validation"
	TaskTypeScheduleConflict  = "schedule_conflict"
	TaskTypeDocumentCheck     = "document_check"
	TaskTypeParentMeeting     = "parent_meeting"
	TaskTypeReportGeneration  = "report_generation"
)

// Énumération des priorités
const (
	PriorityHigh   = "high"
	PriorityMedium = "medium"
	PriorityLow    = "low"
)

// Énumération des statuts de tâches
const (
	TaskStatusPending    = "pending"
	TaskStatusInProgress = "in_progress"
	TaskStatusCompleted  = "completed"
	TaskStatusCancelled  = "cancelled"
)

type SecretariatTask struct {
	gorm.Model
	Type        string    `json:"type" binding:"required"`
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description"`
	Priority    string    `json:"priority" gorm:"default:medium"`
	Status      string    `json:"status" gorm:"default:pending"`
	AssignedTo  uint      `json:"assigned_to"`
	CreatedBy   uint      `json:"created_by"`
	DueDate     time.Time `json:"due_date"`
	CompletedAt *time.Time `json:"completed_at,omitempty"`
	
	// Relations
	AssignedUser User `json:"assigned_user" gorm:"foreignKey:AssignedTo"`
	CreatedByUser User `json:"created_by_user" gorm:"foreignKey:CreatedBy"`
}

type TeacherValidationRequest struct {
	gorm.Model
	TeacherID    uint      `json:"teacher_id"`
	RequestedBy  uint      `json:"requested_by"` // ID du secrétariat qui a initié
	ReviewedBy   *uint     `json:"reviewed_by,omitempty"`
	Status       string    `json:"status" gorm:"default:pending_review"`
	Comments     string    `json:"comments"`
	RequestDate  time.Time `json:"request_date" gorm:"default:CURRENT_TIMESTAMP"`
	ReviewDate   *time.Time `json:"review_date,omitempty"`
	
	// Relations
	Teacher       User  `json:"teacher" gorm:"foreignKey:TeacherID"`
	RequestedByUser User `json:"requested_by_user" gorm:"foreignKey:RequestedBy"`
	ReviewedByUser  *User `json:"reviewed_by_user,omitempty" gorm:"foreignKey:ReviewedBy"`
}

type StudentEnrollmentRequest struct {
	gorm.Model
	StudentName    string    `json:"student_name" binding:"required"`
	StudentEmail   string    `json:"student_email" binding:"required,email"`
	ParentContact  string    `json:"parent_contact" binding:"required"`
	RequestedClass string    `json:"requested_class" binding:"required"`
	Documents      []string  `json:"documents" gorm:"serializer:json"`
	Status         string    `json:"status" gorm:"default:pending_review"`
	ProcessedBy    *uint     `json:"processed_by,omitempty"`
	ProcessedAt    *time.Time `json:"processed_at,omitempty"`
	StudentID      *uint     `json:"student_id,omitempty"` // Une fois l'étudiant créé
	
	// Relations
	ProcessedByUser *User `json:"processed_by_user,omitempty" gorm:"foreignKey:ProcessedBy"`
	Student         *User `json:"student,omitempty" gorm:"foreignKey:StudentID"`
}

type ScheduleConflict struct {
	gorm.Model
	ScheduleID1  uint      `json:"schedule_id_1"`
	ScheduleID2  uint      `json:"schedule_id_2"`
	ConflictType string    `json:"conflict_type"` // classroom, teacher, time
	Description  string    `json:"description"`
	Status       string    `json:"status" gorm:"default:unresolved"`
	ResolvedBy   *uint     `json:"resolved_by,omitempty"`
	ResolvedAt   *time.Time `json:"resolved_at,omitempty"`
	
	// Relations
	Schedule1     Schedule `json:"schedule_1" gorm:"foreignKey:ScheduleID1"`
	Schedule2     Schedule `json:"schedule_2" gorm:"foreignKey:ScheduleID2"`
	ResolvedByUser *User   `json:"resolved_by_user,omitempty" gorm:"foreignKey:ResolvedBy"`
}

type DocumentCheck struct {
	gorm.Model
	StudentID     uint      `json:"student_id"`
	DocumentType  string    `json:"document_type"` // transcript, medical_certificate, etc.
	DocumentPath  string    `json:"document_path"`
	Status        string    `json:"status" gorm:"default:pending"`
	CheckedBy     *uint     `json:"checked_by,omitempty"`
	CheckedAt     *time.Time `json:"checked_at,omitempty"`
	Comments      string    `json:"comments"`
	
	// Relations
	Student       User  `json:"student" gorm:"foreignKey:StudentID"`
	CheckedByUser *User `json:"checked_by_user,omitempty" gorm:"foreignKey:CheckedBy"`
}

// Statistiques pour le tableau de bord secrétariat
type SecretariatStats struct {
	PendingEnrollments     int `json:"pending_enrollments"`
	PendingTeacherRequests int `json:"pending_teacher_requests"`
	UnresolvedConflicts    int `json:"unresolved_conflicts"`
	DocumentsToCheck       int `json:"documents_to_check"`
	TasksToday             int `json:"tasks_today"`
	HighPriorityTasks      int `json:"high_priority_tasks"`
}