package middleware

import (
	"net/http"
	"strings"
	"github.com/gin-gonic/gin"
	"online-learning-platform-backend/models"
)

// RequireAuth middleware vérifie si l'utilisateur est authentifié
func RequireAuth() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token d'autorisation manquant"})
			c.Abort()
			return
		}

		// Extraire le token (Bearer <token>)
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Format de token invalide"})
			c.Abort()
			return
		}

		token := tokenParts[1]
		
		// TODO: Valider le JWT token ici
		// Pour l'instant, simulation basique
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token invalide"})
			c.Abort()
			return
		}

		// TODO: Récupérer l'utilisateur depuis le token
		// Pour l'instant, simulation
		user := &models.User{
			Role:   "student", // Sera extrait du token JWT
			Status: models.StatusActive,
		}
		
		c.Set("user", user)
		c.Next()
	})
}

// RequireRole middleware vérifie si l'utilisateur a le rôle requis
func RequireRole(roles ...string) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		user, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Utilisateur non authentifié"})
			c.Abort()
			return
		}

		currentUser := user.(*models.User)
		
		// Vérifier si l'utilisateur a un des rôles requis
		hasRole := false
		for _, role := range roles {
			if currentUser.Role == role {
				hasRole = true
				break
			}
		}

		if !hasRole {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Accès refusé - rôle insuffisant",
				"required_roles": roles,
				"user_role": currentUser.Role,
			})
			c.Abort()
			return
		}

		c.Next()
	})
}

// RequirePermission middleware vérifie si l'utilisateur a la permission requise
func RequirePermission(permission string) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		user, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Utilisateur non authentifié"})
			c.Abort()
			return
		}

		currentUser := user.(*models.User)
		
		if !currentUser.HasPermission(permission) {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Permission insuffisante",
				"required_permission": permission,
			})
			c.Abort()
			return
		}

		c.Next()
	})
}

// RequireAdminOrSelf permet l'accès aux admins ou au propriétaire de la ressource
func RequireAdminOrSelf(userIDParam string) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		user, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Utilisateur non authentifié"})
			c.Abort()
			return
		}

		currentUser := user.(*models.User)
		targetUserID := c.Param(userIDParam)
		
		// Autoriser si admin ou si c'est sa propre ressource
		if currentUser.IsAdmin() || targetUserID == string(rune(currentUser.ID)) {
			c.Next()
			return
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "Accès refusé"})
		c.Abort()
	})
}

// RequireValidatedTeacher vérifie que l'enseignant est validé
func RequireValidatedTeacher() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		user, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Utilisateur non authentifié"})
			c.Abort()
			return
		}

		currentUser := user.(*models.User)
		
		if !currentUser.IsValidatedTeacher() {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Accès refusé - enseignant non validé",
				"status": currentUser.Status,
				"message": "Votre compte enseignant est en attente de validation par l'administration",
			})
			c.Abort()
			return
		}

		c.Next()
	})
}