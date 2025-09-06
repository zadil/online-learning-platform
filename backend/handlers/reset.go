package handlers

import (
	"context"
	"database/sql"
	"net/http"
	"online-learning-platform-backend/internal/db"

	"github.com/gin-gonic/gin"
)

// ResetUsers - DANGER: Supprime tous les users (pour développement uniquement)
func ResetUsers(queries *db.Queries, dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.Background()
		
		// Supprimer tous les users
		_, err := dbConn.ExecContext(ctx, "DELETE FROM users")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to reset users",
				"debug": err.Error(),
			})
			return
		}
		
		// Réinitialiser le séquence ID
		_, err = dbConn.ExecContext(ctx, "ALTER SEQUENCE users_id_seq RESTART WITH 1")
		if err != nil {
			// Pas grave si ça échoue
		}
		
		c.JSON(http.StatusOK, gin.H{
			"message": "All users deleted successfully",
			"warning": "This endpoint should only be used in development",
		})
	}
}