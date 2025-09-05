package routes

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"online-learning-platform-backend/handlers"
	"online-learning-platform-backend/internal/db"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func RegisterBootstrapRoutes(r *gin.Engine, queries *db.Queries, dbConn *sql.DB) {
	// Créer une instance GORM pour les handlers qui en ont besoin
	gormDB, err := gorm.Open(postgres.New(postgres.Config{
		Conn: dbConn,
	}), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database via GORM: " + err.Error())
	}
	
	// Créer le handler avec GORM
	handler := handlers.NewBootstrapHandler(gormDB)
	
	// Groupe de routes bootstrap
	bootstrap := r.Group("/bo/setup")
	{
		bootstrap.GET("/bootstrap", handler.CheckBootstrapAvailability)
		bootstrap.POST("/create-admin", handler.CreateFirstAdmin)
	}
}