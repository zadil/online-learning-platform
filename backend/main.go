package main

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"net/http"
	_ "github.com/lib/pq"
	"log"
	"strings"
	"online-learning-platform-backend/internal/db"
	"online-learning-platform-backend/routes"
)

// Initialise la base de données avec les tables nécessaires
func initializeDatabase(dbConn *sql.DB) error {
	// Créer la table users si elle n'existe pas
	usersTable := `
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			email TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL,
			role TEXT NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);
	`
	
	if _, err := dbConn.Exec(usersTable); err != nil {
		return err
	}
	
	// Créer la table courses si elle n'existe pas
	coursesTable := `
		CREATE TABLE IF NOT EXISTS courses (
			id SERIAL PRIMARY KEY,
			title TEXT NOT NULL,
			description TEXT,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			author_id INTEGER REFERENCES users(id)
		);
	`
	
	if _, err := dbConn.Exec(coursesTable); err != nil {
		return err
	}
	
	log.Println("✅ Tables de base de données initialisées avec succès")
	return nil
}




func main() {
	dbConn, err := sql.Open("postgres", "host=db port=5432 user=postgres password=postgres dbname=online_learning sslmode=disable")
	if err != nil {
		log.Fatalf("Erreur de connexion à la base de données : %v", err)
	}
	defer dbConn.Close()

	// Créer les tables si elles n'existent pas
	if err := initializeDatabase(dbConn); err != nil {
		log.Fatalf("Erreur lors de l'initialisation de la base de données : %v", err)
	}

	queries := db.New(dbConn)

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000", "http://127.0.0.1:58908", "http://localhost:58908"},
		AllowOriginFunc: func(origin string) bool {
			// Autorise tout localhost, 127.0.0.1 et les domaines sandbox e2b.dev
			return origin == "http://localhost:5173" || origin == "http://127.0.0.1:5173" || origin == "http://localhost:3000" || origin == "http://127.0.0.1:3000" || origin == "http://127.0.0.1:58908" || origin == "http://localhost:58908" ||
				strings.HasPrefix(origin, "http://localhost:") || strings.HasPrefix(origin, "http://127.0.0.1:") || strings.HasSuffix(origin, ".e2b.dev")
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	routes.RegisterUserRoutes(r, queries, dbConn)
	routes.RegisterAuthRoutes(r, queries, dbConn)
	routes.RegisterCoursesRoutes(r, queries, dbConn)
	routes.RegisterBootstrapRoutes(r, queries, dbConn)
	routes.RegisterAdminRoutes(r, queries, dbConn)
	routes.RegisterSecretariatRoutes(r, queries, dbConn)

	routes.RegisterProtectedRoutes(r, dbConn)

	r.Run() // listen and serve on 0.0.0.0:8080
}
