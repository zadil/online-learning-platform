package handlers

import (
	"context"
	"database/sql"
	"net/http"
	"online-learning-platform-backend/internal/db"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// Configuration pour l'authentification admin sécurisée
var adminConfig = struct {
	ValidEmails []string
	AdminKey    string
}{
	ValidEmails: []string{
		"directeur@ecole-moderne.fr",
		"admin@ecole-moderne.fr",
		"superadmin@ecole-moderne.fr",
	},
	AdminKey: "SecureAdmin2024!@#",
}

// AdminLogin - Authentification triple facteur pour admin
func AdminLogin(queries *db.Queries, dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Email    string `json:"email" binding:"required,email"`
			Password string `json:"password" binding:"required"`
			AdminKey string `json:"adminKey" binding:"required"`
			Source   string `json:"source"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Données invalides: " + err.Error(),
			})
			return
		}

		// Vérification 1: Email dans la liste blanche
		emailValid := false
		for _, validEmail := range adminConfig.ValidEmails {
			if req.Email == validEmail {
				emailValid = true
				break
			}
		}

		if !emailValid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Email non autorisé pour l'accès administrateur",
			})
			return
		}

		// Vérification 2: Clé admin secrète
		if req.AdminKey != adminConfig.AdminKey {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Clé administrateur invalide",
			})
			return
		}

		// Vérification 3: Mot de passe en base
		ctx := context.Background()
		user, err := queries.GetUserByEmail(ctx, req.Email)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Identifiants invalides",
			})
			return
		}

		// Vérifier le mot de passe hashé
		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Mot de passe invalide",
			})
			return
		}

		// Vérifier que l'utilisateur est bien admin
		if user.Role != "admin" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Privilèges administrateur requis",
			})
			return
		}

		// Générer un token JWT spécial admin
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": user.ID,
			"email":   user.Email,
			"role":    user.Role,
			"type":    "admin_session",
			"exp":     time.Now().Add(2 * time.Hour).Unix(), // 2 heures
		})

		// Signer le token (utiliser une clé secrète en production)
		tokenString, err := token.SignedString([]byte("your-secret-key"))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Erreur lors de la génération du token",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"token": tokenString,
			"user": gin.H{
				"id":        user.ID,
				"name":      user.Name,
				"email":     user.Email,
				"role":      user.Role,
				"createdAt": user.CreatedAt,
			},
			"sessionId":  "secure-admin-session-" + time.Now().Format("20060102150405"),
			"expiresAt":  time.Now().Add(2 * time.Hour).Format(time.RFC3339),
			"adminLevel": "full_access",
		})
	}
}

// AdminLogout - Déconnexion admin
func AdminLogout(queries *db.Queries, dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// TODO: Invalider le token côté serveur (blacklist)
		c.JSON(http.StatusOK, gin.H{
			"message":        "Déconnexion admin réussie",
			"session_closed": true,
		})
	}
}

// AdminSecurityStats - Statistiques de sécurité
func AdminSecurityStats(queries *db.Queries, dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Statistiques de sécurité mockées
		stats := gin.H{
			"login_attempts":       47,
			"failed_logins":        3,
			"active_sessions":      12,
			"security_alerts":      1,
			"last_breach_attempt":  "2024-01-15T10:30:00Z",
			"blocked_ips":          5,
			"admin_sessions_today": 3,
			"security_level":       "high",
		}

		c.JSON(http.StatusOK, stats)
	}
}

// AdminSecurityLogs - Logs de sécurité
func AdminSecurityLogs(queries *db.Queries, dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Logs de sécurité mockés
		logs := []gin.H{
			{
				"id":        1,
				"event":     "Tentative de connexion échouée depuis 192.168.1.100",
				"level":     "warning",
				"timestamp": time.Now().Add(-5 * time.Minute).Format(time.RFC3339),
				"ip":        "192.168.1.100",
			},
			{
				"id":        2,
				"event":     "Connexion admin réussie",
				"level":     "info",
				"timestamp": time.Now().Add(-15 * time.Minute).Format(time.RFC3339),
				"ip":        "192.168.1.50",
			},
			{
				"id":        3,
				"event":     "Tentative d'accès non autorisé à /bo/admin",
				"level":     "critical",
				"timestamp": time.Now().Add(-30 * time.Minute).Format(time.RFC3339),
				"ip":        "10.0.0.25",
			},
		}

		c.JSON(http.StatusOK, logs)
	}
}

// AdminSystemHealth - Santé du système
func AdminSystemHealth(queries *db.Queries, dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Santé système mockée
		health := gin.H{
			"status":           "OK",
			"uptime":           "99.98",
			"database_status":  "connected",
			"last_backup":      "2024-01-20T02:00:00Z",
			"disk_usage":       "45%",
			"memory_usage":     "62%",
			"cpu_usage":        "23%",
			"active_users":     156,
			"system_load":      "normal",
			"security_status":  "secure",
		}

		c.JSON(http.StatusOK, health)
	}
}