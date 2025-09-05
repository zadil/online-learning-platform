# 🔐 Guide de Bootstrap Admin - Première Configuration

Ce guide explique comment créer le tout premier compte administrateur dans le système École Moderne.

## 🎯 Problème Résolu

Le système nécessite un administrateur pour créer d'autres comptes administrateurs, mais comment créer le premier admin ? C'est le problème classique de "poule et œuf" que résout notre système de bootstrap sécurisé.

## 🔧 Solution : Bootstrap Sécurisé One-Time

### Caractéristiques de Sécurité

- ✅ **Usage Unique** : Le bootstrap se désactive automatiquement après la première utilisation
- ✅ **Clé Secrète** : Requiert une clé de bootstrap secrète fournie lors de l'installation
- ✅ **Anti-Bruteforce** : Verrouillage de 15 minutes après 3 tentatives échouées
- ✅ **Validation Stricte** : Validation complète des données avant création
- ✅ **Route Sécurisée** : Accessible uniquement via `/bo/setup`

## 📋 Instructions d'Utilisation

### 1. Démarrer les Services

```bash
# Démarrer le backend mock
cd /home/user/webapp && npm start

# Dans un autre terminal, démarrer le frontend
cd /home/user/webapp/frontend && npm run dev
```

### 2. Accéder au Bootstrap

Rendez-vous sur : `http://localhost:5173/bo/setup`

### 3. Informations Requises

Pour créer le premier admin, vous aurez besoin de :

- **Nom Complet** : Ex: "Directeur Principal"
- **Email** : Ex: "admin@ecole-moderne.fr"  
- **Mot de passe** : Minimum 8 caractères
- **Confirmation du mot de passe**
- **🔑 Clé de Bootstrap** : `BOOTSTRAP_ADMIN_2024_SECRET_KEY_XYZ123`

### 4. Processus de Création

1. Remplissez tous les champs requis
2. Entrez la clé de bootstrap secrète
3. Cliquez sur "Créer le Premier Administrateur"
4. Le système valide et crée le compte
5. **Le bootstrap se désactive automatiquement**
6. Redirection automatique vers `/bo/admin` après 3 secondes

## 🔒 Mesures de Sécurité

### Protection Anti-Bruteforce

- **3 tentatives maximum** avec la mauvaise clé de bootstrap
- **Verrouillage de 15 minutes** après échec des 3 tentatives
- **Reset automatique** du compteur après expiration du verrouillage

### Clé de Bootstrap

```javascript
// Clé secrète par défaut (à changer en production)
bootstrapKey: 'BOOTSTRAP_ADMIN_2024_SECRET_KEY_XYZ123'
```

⚠️ **IMPORTANT** : En production, changez cette clé dans `mock-backend.js` ligne 6.

### Validation des Données

- Email doit contenir un @ valide
- Mot de passe minimum 8 caractères
- Nom obligatoire et non vide
- Vérification que les mots de passe correspondent

## 📊 États du Bootstrap

### Disponible ✅
```json
{
  "available": true,
  "message": "Bootstrap disponible pour création du premier admin",
  "attempts_remaining": 3
}
```

### Verrouillé Temporairement 🔒
```json
{
  "error": "Bootstrap non disponible",
  "reason": "temporairement verrouillé",
  "lockoutUntil": "2024-01-15T14:30:00.000Z"
}
```

### Déjà Utilisé ❌
```json
{
  "error": "Bootstrap non disponible", 
  "reason": "déjà utilisé"
}
```

## 🛠 API Endpoints

### Vérifier la Disponibilité
```
GET /bo/setup/bootstrap
```

### Créer le Premier Admin
```
POST /bo/setup/create-admin
Content-Type: application/json

{
  "name": "Directeur Principal",
  "email": "admin@ecole-moderne.fr",
  "password": "motdepasse123",
  "bootstrapKey": "BOOTSTRAP_ADMIN_2024_SECRET_KEY_XYZ123"
}
```

## 🚨 Après la Première Utilisation

Une fois le premier admin créé :

1. **Bootstrap désactivé** : La route `/bo/setup` devient inaccessible
2. **Redirection automatique** : L'utilisateur est redirigé vers `/bo/admin`
3. **Connexion normale** : Utilisation du système de triple authentification admin
4. **Création d'autres admins** : Via l'interface d'administration normale

## 🔐 Triple Authentification Admin

Le compte admin créé peut ensuite se connecter via `/bo/admin` avec :

1. **Email** de la liste blanche
2. **Mot de passe** correct  
3. **Clé Admin secrète** : `SecureAdmin2024!@#`

## 🧪 Test du Système

### Scénario de Test Complet

1. **Première visite** → Bootstrap disponible
2. **Mauvaise clé** → Tentative échouée (2 restantes)
3. **Mauvaise clé x2** → Tentative échouée (0 restantes)  
4. **Mauvaise clé x3** → Verrouillage 15 minutes
5. **Attendre** → Déverrouillage automatique
6. **Bonne clé + données valides** → Admin créé ✅
7. **Nouvelle visite** → Bootstrap indisponible (déjà utilisé)

### Données de Test

```json
{
  "name": "Test Admin",
  "email": "test@ecole-moderne.fr", 
  "password": "TestAdmin123!",
  "bootstrapKey": "BOOTSTRAP_ADMIN_2024_SECRET_KEY_XYZ123"
}
```

## ⚡ Workflow de Production

### Installation Initiale

1. Déployer l'application avec bootstrap activé
2. Fournir la clé de bootstrap aux administrateurs autorisés  
3. L'administrateur initial se rend sur `/bo/setup`
4. Création du premier compte admin
5. Bootstrap automatiquement désactivé
6. Seuls les admins existants peuvent créer de nouveaux admins

### Sécurité en Production

- **Changer la clé de bootstrap** avant déploiement
- **Logs d'audit** pour tracer les tentatives de bootstrap
- **HTTPS obligatoire** pour toutes les opérations sensibles
- **Surveillance** des tentatives de bruteforce

## 🔧 Configuration Avancée

### Personnaliser le Bootstrap

Dans `mock-backend.js`, modifiez :

```javascript
let bootstrapConfig = {
  enabled: true,                    // Activer/désactiver
  bootstrapKey: 'VOTRE_CLE_ICI',   // Votre clé secrète
  maxAttempts: 3,                  // Nombre de tentatives
  lockoutDuration: 15 * 60 * 1000  // Durée de verrouillage (15 min)
};
```

### Réactiver le Bootstrap (Développement)

```javascript
// UNIQUEMENT pour le développement - JAMAIS en production
bootstrapConfig.enabled = true;
bootstrapConfig.used = false;
bootstrapConfig.attempts = 0;
bootstrapConfig.lockoutUntil = null;
```

## 📝 Notes Importantes

- 🚫 **NE JAMAIS** laisser le bootstrap activé en production après utilisation
- 🔑 **TOUJOURS** changer la clé de bootstrap par défaut
- 📝 **DOCUMENTER** qui a créé le premier admin et quand
- 🔍 **AUDITER** toutes les tentatives de bootstrap
- 🔒 **SÉCURISER** l'accès à la configuration backend

---

## 🆘 Support et Dépannage

### Bootstrap Non Disponible

- Vérifier si un admin existe déjà
- Attendre la fin du verrouillage si applicable
- Vérifier la configuration dans `mock-backend.js`

### Erreurs de Création

- Valider le format email
- Vérifier la longueur du mot de passe  
- S'assurer de la correspondance des mots de passe
- Contrôler la clé de bootstrap

### Redirection Non Fonctionnelle

- Vérifier que la route `/bo/admin` est accessible
- Contrôler les logs de la console navigateur
- Tester manuellement l'accès à `/bo/admin`

---

**📧 Contact** : Pour toute question technique, consultez la documentation ou contactez l'équipe de développement.