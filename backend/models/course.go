package models

import (
	"gorm.io/gorm"
	"time"
)

// Énumération des statuts de cours
const (
	CourseStatusActive      = "active"       // Cours actif
	CourseStatusNeedTeacher = "need_teacher" // Cours sans enseignant
	CourseStatusSuspended   = "suspended"    // Cours suspendu
	CourseStatusCompleted   = "completed"    // Cours terminé
)

type Course struct {
	gorm.Model
	Title          string    `json:"title" binding:"required"`
	Description    string    `json:"description"`
	Class          string    `json:"class" binding:"required"` // Classe concernée (Terminale S, 1ère ES, etc.)
	Schedule       string    `json:"schedule"`                 // Emploi du temps
	StudentsCount  int       `json:"students_count" gorm:"default:0"`
	Status         string    `json:"status" gorm:"default:need_teacher"`
	
	// Relations
	Teachers    []User       `json:"teachers" gorm:"many2many:course_teachers;"`
	Enrollments []Enrollment `json:"enrollments"`
	Assignments []Assignment `json:"assignments"`
	Schedules   []Schedule   `json:"schedules"`
}

type Enrollment struct {
	gorm.Model
	UserID     uint      `json:"user_id"`
	CourseID   uint      `json:"course_id"`
	EnrolledAt time.Time `json:"enrolled_at" gorm:"default:CURRENT_TIMESTAMP"`
	Status     string    `json:"status" gorm:"default:active"` // active, completed, dropped
	
	// Relations
	User   User   `json:"user" gorm:"foreignKey:UserID"`
	Course Course `json:"course" gorm:"foreignKey:CourseID"`
}

type Assignment struct {
	gorm.Model
	CourseID    uint      `json:"course_id"`
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description"`
	DueDate     time.Time `json:"due_date"`
	MaxPoints   float64   `json:"max_points" gorm:"default:20"`
	Status      string    `json:"status" gorm:"default:active"`
	
	// Relations
	Course      Course           `json:"course" gorm:"foreignKey:CourseID"`
	Submissions []AssignmentSubmission `json:"submissions"`
}

type AssignmentSubmission struct {
	gorm.Model
	AssignmentID uint      `json:"assignment_id"`
	StudentID    uint      `json:"student_id"`
	Content      string    `json:"content"`
	SubmittedAt  time.Time `json:"submitted_at" gorm:"default:CURRENT_TIMESTAMP"`
	Grade        *float64  `json:"grade,omitempty"`
	Feedback     string    `json:"feedback"`
	Status       string    `json:"status" gorm:"default:submitted"`
	
	// Relations
	Assignment Assignment `json:"assignment" gorm:"foreignKey:AssignmentID"`
	Student    User       `json:"student" gorm:"foreignKey:StudentID"`
}

type Schedule struct {
	gorm.Model
	CourseID    uint      `json:"course_id"`
	DayOfWeek   int       `json:"day_of_week"`   // 1=Lundi, 2=Mardi, etc.
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`
	Classroom   string    `json:"classroom"`
	IsRecurring bool      `json:"is_recurring" gorm:"default:true"`
	
	// Relations
	Course Course `json:"course" gorm:"foreignKey:CourseID"`
}