# 🚀 Setup Guide - Online Learning Platform

## Architecture
- **Backend** : Go + Gin + PostgreSQL + sqlc + sqitch
- **Frontend** : React + Vite + Tailwind CSS
- **Database** : PostgreSQL avec migrations sqitch
- **Containerization** : Docker + Docker Compose

## 🔧 Installation

### 1. Démarrage
```bash
# Cloner le repo et aller dans le dossier
cd online-learning-platform

# Démarrer avec Docker Compose
docker-compose up --build
```

### 2. Services disponibles
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:8080
- **Database** : PostgreSQL sur port 5432

## 🔐 Bootstrap Admin (Première fois uniquement)

### Créer le premier administrateur
1. **URL** : http://localhost:5173/bo/setup
2. **Clé Bootstrap** : `BOOTSTRAP_ADMIN_2024_SECRET_KEY_XYZ123`
3. **Remplir** : Nom, Email, Mot de passe
4. **Le bootstrap se désactive** automatiquement après usage

### Emails autorisés pour admin
- directeur@ecole-moderne.fr
- admin@ecole-moderne.fr  
- superadmin@ecole-moderne.fr
- admin@gmail.com

## 🔑 Connexion Admin Back-Office

### Après avoir créé le premier admin
1. **URL** : http://localhost:5173/bo/admin
2. **Email** : celui créé via bootstrap
3. **Mot de passe** : celui choisi via bootstrap  
4. **Clé Admin** : `SecureAdmin2024!@#`

## 📊 Endpoints API

### Bootstrap (usage unique)
- `GET /bo/setup/bootstrap` - Vérifier disponibilité
- `POST /bo/setup/create-admin` - Créer premier admin

### Admin Back-Office
- `POST /bo/admin/login` - Authentification admin
- `GET /bo/admin/security-stats` - Statistiques sécurité
- `GET /bo/admin/security-logs` - Logs sécurité
- `GET /bo/admin/system-health` - Santé système

### Admin Dashboard  
- `GET /admin/dashboard-stats` - Statistiques dashboard
- `GET /admin/teacher-requests` - Demandes enseignants

### Secrétariat
- `GET /secretariat/tasks` - Tâches secrétariat
- `GET /secretariat/stats` - Statistiques secrétariat

## 🛠 Développement

### Backend Go
```bash
cd backend
go build -o online-learning-platform
./online-learning-platform
```

### Frontend React
```bash  
cd frontend
npm install
npm run dev
```

### Base de données
```bash
# Migrations avec sqitch
cd backend
sqitch deploy db:pg://postgres:postgres@localhost/online_learning
```

## 🔒 Sécurité

### Bootstrap
- Usage unique avec auto-désactivation
- Anti-bruteforce (3 tentatives, lockout 15min)  
- Clé secrète requise

### Admin Back-Office
- Triple authentification (email + password + admin key)
- Email whitelist
- JWT tokens avec expiration
- Logs d'audit

## 📝 Notes

- **Un seul backend** : Go uniquement (plus de mock Node.js)
- **Architecture sqlc** : Queries typées générées
- **Migrations sqitch** : Schéma de base géré
- **Docker** : Environnement complètement containerisé