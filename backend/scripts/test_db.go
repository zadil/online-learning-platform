package main

import (
	"context"
	"fmt"
	"online-learning-platform-backend/config"
	"online-learning-platform-backend/internal/db"
)

func main() {
	config.ConnectDatabase()
	
	// Convertir GORM DB en *sql.DB
	sqlDB, err := config.DB.DB()
	if err != nil {
		fmt.Printf("Erreur conversion DB: %v\n", err)
		return
	}
	defer sqlDB.Close()
	
	// Test simple query
	ctx := context.Background()
	queries := db.New(sqlDB)
	_, err = queries.ListCourses(ctx)
	if err != nil {
		fmt.Printf("Erreur ListCourses: %v\n", err)
		return
	}
	fmt.Println("Connexion DB et requête ListCourses OK")
}
