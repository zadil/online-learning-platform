package handlers

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"online-learning-platform-backend/internal/db"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// Configuration bootstrap - pour créer le premier admin
var bootstrapConfig = struct {
	Enabled      bool       `json:"enabled"`
	BootstrapKey string     `json:"-"`
	MaxAttempts  int        `json:"max_attempts"`
	Attempts     int        `json:"attempts"`
	LockoutUntil *time.Time `json:"lockout_until,omitempty"`
	Used         bool       `json:"used"`
}{
	Enabled:      true,
	BootstrapKey: "BOOTSTRAP_ADMIN_2024_SECRET_KEY_XYZ123",
	MaxAttempts:  3,
	Attempts:     0,
	LockoutUntil: nil,
	Used:         false,
}

// Vérifier si le bootstrap est disponible
func isBootstrapAvailable() bool {
	if !bootstrapConfig.Enabled || bootstrapConfig.Used {
		return false
	}

	// Vérifier si on est en lockout
	if bootstrapConfig.LockoutUntil != nil && time.Now().Before(*bootstrapConfig.LockoutUntil) {
		return false
	}

	// Réinitialiser le lockout si expiré
	if bootstrapConfig.LockoutUntil != nil && time.Now().After(*bootstrapConfig.LockoutUntil) {
		bootstrapConfig.LockoutUntil = nil
		bootstrapConfig.Attempts = 0
	}

	return true
}

// CheckBootstrapAvailability vérifie la disponibilité du bootstrap
func CheckBootstrapAvailability(queries *db.Queries, dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !isBootstrapAvailable() {
			reason := "temporairement verrouillé"
			if bootstrapConfig.Used {
				reason = "déjà utilisé"
			}

			c.JSON(http.StatusForbidden, gin.H{
				"error":        "Bootstrap non disponible",
				"reason":       reason,
				"lockoutUntil": bootstrapConfig.LockoutUntil,
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"available":           true,
			"message":            "Bootstrap disponible pour création du premier admin",
			"attempts_remaining": bootstrapConfig.MaxAttempts - bootstrapConfig.Attempts,
		})
	}
}

// CreateFirstAdmin crée le premier administrateur
func CreateFirstAdmin(queries *db.Queries, dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !isBootstrapAvailable() {
			reason := "temporairement verrouillé"
			if bootstrapConfig.Used {
				reason = "déjà utilisé"
			}

			c.JSON(http.StatusForbidden, gin.H{
				"error":  "Bootstrap non disponible",
				"reason": reason,
			})
			return
		}

		var req struct {
			Name         string `json:"name" binding:"required"`
			Email        string `json:"email" binding:"required,email"`
			Password     string `json:"password" binding:"required,min=8"`
			BootstrapKey string `json:"bootstrapKey" binding:"required"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Données invalides: " + err.Error(),
			})
			return
		}

		// Vérifier la clé de bootstrap
		if req.BootstrapKey != bootstrapConfig.BootstrapKey {
			bootstrapConfig.Attempts++

			// Verrouiller après maxAttempts tentatives
			if bootstrapConfig.Attempts >= bootstrapConfig.MaxAttempts {
				lockout := time.Now().Add(15 * time.Minute)
				bootstrapConfig.LockoutUntil = &lockout
			}

			c.JSON(http.StatusUnauthorized, gin.H{
				"error":              "Clé de bootstrap invalide",
				"attempts_remaining": bootstrapConfig.MaxAttempts - bootstrapConfig.Attempts,
			})
			return
		}

		ctx := context.Background()

		// Vérifier si un admin existe déjà
		adminCount, err := queries.CountUsersByRole(ctx, "admin")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Erreur lors de la vérification des administrateurs existants",
				"debug": err.Error(),
			})
			return
		}

		if adminCount > 0 {
			c.JSON(http.StatusConflict, gin.H{
				"error": "Un administrateur existe déjà",
				"debug": fmt.Sprintf("Found %d admin(s) in database", adminCount),
			})
			return
		}

		// Hasher le mot de passe
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Erreur lors du hashage du mot de passe",
			})
			return
		}

		// Créer le premier admin
		admin, err := queries.CreateFirstAdmin(ctx, db.CreateFirstAdminParams{
			Name:     req.Name,
			Email:    req.Email,
			Password: string(hashedPassword),
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Erreur lors de la création de l'administrateur: " + err.Error(),
			})
			return
		}

		// Désactiver le bootstrap après utilisation
		bootstrapConfig.Used = true
		bootstrapConfig.Enabled = false

		c.JSON(http.StatusCreated, gin.H{
			"success": true,
			"message": "Premier administrateur créé avec succès",
			"admin": gin.H{
				"id":        admin.ID,
				"name":      admin.Name,
				"email":     admin.Email,
				"role":      admin.Role,
				"createdAt": admin.CreatedAt,
			},
			"bootstrap_disabled": true,
		})
	}
}