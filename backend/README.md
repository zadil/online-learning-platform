# Backend Go (Golang)

## Stack
- Framework web : Gin (https://gin-gonic.com/)
- ORM : GORM (https://gorm.io/)
- Authentification : JWT (github.com/golang-jwt/jwt)
- Validation : go-playground/validator
- Gestion de configuration : Viper
- Base de données : PostgreSQL

## Lancement rapide

1. Installer Go (https://golang.org/dl/)
2. Installer PostgreSQL
3. Initialiser le projet :
   ```sh
   go mod init online-learning-platform-backend
   go get github.com/gin-gonic/gin
   go get gorm.io/gorm
   go get gorm.io/driver/postgres
   go get github.com/golang-jwt/jwt/v5
   go get github.com/go-playground/validator/v10
   go get github.com/spf13/viper
   ```
4. Lancer le serveur :
   ```sh
   go run main.go
   ```

## Structure recommandée
- `main.go` : point d’entrée
- `/config` : gestion de la configuration
- `/models` : modèles de données
- `/routes` : routes HTTP
- `/controllers` : logique métier
- `/middleware` : middlewares (auth, etc.)
- `/utils` : fonctions utilitaires

---

Prêt pour l’initialisation du backend Go !
