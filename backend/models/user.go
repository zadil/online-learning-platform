package models

import (
	"gorm.io/gorm"
	"time"
	"github.com/lib/pq"
)

// Énumération des rôles
const (
	RoleAdmin      = "admin"      // Directeur/Direction
	RoleSecretariat = "secretariat" // Secrétariat
	RoleTeacher    = "teacher"     // Enseignant
	RoleStudent    = "student"     // Élève
)

// Énumération des statuts utilisateur
const (
	StatusActive           = "active"             // Utilisateur actif
	StatusPendingValidation = "pending_validation" // Enseignant en attente de validation
	StatusValidated        = "validated"          // Enseignant validé
	StatusSuspended        = "suspended"          // Utilisateur suspendu
	StatusInactive         = "inactive"           // Utilisateur inactif
)

type User struct {
	gorm.Model
	Name         string         `json:"name" binding:"required"`
	Email        string         `json:"email" gorm:"uniqueIndex" binding:"required,email"`
	Password     string         `json:"-" binding:"required,min=6"`
	Role         string         `json:"role" binding:"required,oneof=admin secretariat teacher student"`
	Status       string         `json:"status" gorm:"default:active"`
	Permissions  pq.StringArray `json:"permissions" gorm:"type:text[]"`
	
	// Champs spécifiques aux enseignants
	Department      *string    `json:"department,omitempty"`
	Specialization  *string    `json:"specialization,omitempty"`
	Experience      *string    `json:"experience,omitempty"`
	Documents       pq.StringArray `json:"documents,omitempty" gorm:"type:text[]"`
	ValidatedBy     *uint      `json:"validated_by,omitempty"`
	ValidatedAt     *time.Time `json:"validated_at,omitempty"`
	
	// Champs spécifiques aux étudiants
	StudentID      *string `json:"student_id,omitempty"`
	Class          *string `json:"class,omitempty"`
	ParentContact  *string `json:"parent_contact,omitempty"`
	
	// Relations
	ValidatedByUser *User `json:"validated_by_user,omitempty" gorm:"foreignKey:ValidatedBy"`
	Courses        []Course `json:"courses,omitempty" gorm:"many2many:course_teachers;"`
	Enrollments    []Enrollment `json:"enrollments,omitempty"`
}

// Méthodes utilitaires pour la gestion des permissions
func (u *User) HasPermission(permission string) bool {
	for _, perm := range u.Permissions {
		if perm == "all" || perm == permission {
			return true
		}
	}
	return false
}

func (u *User) IsAdmin() bool {
	return u.Role == RoleAdmin
}

func (u *User) IsTeacher() bool {
	return u.Role == RoleTeacher
}

func (u *User) IsValidatedTeacher() bool {
	return u.Role == RoleTeacher && u.Status == StatusValidated
}

func (u *User) IsStudent() bool {
	return u.Role == RoleStudent
}

func (u *User) IsSecretariat() bool {
	return u.Role == RoleSecretariat
}

// GetDefaultPermissions retourne les permissions par défaut selon le rôle
func GetDefaultPermissions(role string) []string {
	switch role {
	case RoleAdmin:
		return []string{"all"}
	case RoleSecretariat:
		return []string{"manage_students", "manage_enrollments", "view_reports", "manage_schedules"}
	case RoleTeacher:
		return []string{"manage_courses", "view_students", "manage_grades"}
	case RoleStudent:
		return []string{"view_courses", "submit_assignments"}
	default:
		return []string{}
	}
}
