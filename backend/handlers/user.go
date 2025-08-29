package handlers

import (
	"context"
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"golang.org/x/crypto/bcrypt"
	"online-learning-platform-backend/internal/db"
)

var validate = validator.New()

// Handler d'inscription utilisateur
func RegisterUserHandler(queries *db.Queries, dbConn *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Name     string `json:"name" binding:"required"`
			Email    string `json:"email" binding:"required,email"`
			Password string `json:"password" binding:"required,min=6,max=72"`
			Role     string `json:"role" binding:"required,oneof=student teacher admin"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			if fieldErr, ok := err.(validator.ValidationErrors); ok {
				for _, e := range fieldErr {
					if e.Field() == "Password" && e.Tag() == "min" {
						c.JSON(http.StatusBadRequest, gin.H{"error": "Le mot de passe doit contenir au moins 6 caractères"})
						return
					}
				}
			}
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors du hash du mot de passe"})
			return
		}
		user, err := queries.CreateUser(ctx, db.CreateUserParams{
			Name:     req.Name,
			Email:    req.Email,
			Password: string(hashedPassword),
			Role:     req.Role,
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, user)
	}
}
