# 🔐 Guide d'Accès Administrateur Sécurisé

## 🎯 Route Back-Office Admin

L'accès administrateur se fait via une **route sécurisée non-listée** pour des raisons de sécurité :

```
🔗 URL: https://your-domain.com/bo/admin
```

## 🔑 Identifiants de Connexion

### Authentification à Trois Facteurs

1. **📧 Email Administrateur** (whitelist)
   - `directeur@ecole-moderne.fr`
   - `admin@ecole-moderne.fr`  
   - `superadmin@ecole-moderne.fr`

2. **🔒 Mot de passe** 
   - Minimum 6 caractères
   - Exemple: `password123` (à changer en production)

3. **🗝️ Clé d'Accès Administrateur**
   - `SecureAdmin2024!@#`

## 🛡️ Mesures de Sécurité

### Protection Anti-Bruteforce
- ⚠️ **3 tentatives maximum**
- 🚫 **Blocage de 15 minutes** après échec
- 📊 **Logging complet** de toutes les tentatives

### Monitoring de Sécurité
- 🔍 **Suivi des connexions** en temps réel
- 🚨 **Alertes automatiques** pour activité suspecte
- 📱 **Sessions limitées dans le temps** (2h d'expiration)
- 🌐 **Traçage des adresses IP**

### Fonctionnalités Back-Office

#### 📊 Dashboard Sécurité
- Statistiques de connexion en temps réel
- Logs d'événements de sécurité
- Monitoring système (CPU, mémoire, connexions)
- Contrôles d'urgence (verrouillage, maintenance)

#### 👥 Gestion Avancée
- Supervision complète des utilisateurs
- Validation/rejet des enseignants
- Gestion des rôles et permissions
- Configuration système

## 🚀 Procédure de Connexion

### Étape 1: Accéder à la Route
```
Naviguer vers: /bo/admin
```

### Étape 2: Authentification
1. Saisir un email admin valide
2. Entrer le mot de passe  
3. **IMPORTANT**: Saisir la clé d'accès admin
4. Cliquer sur "Accès Admin"

### Étape 3: Redirection Automatique
```
Redirection vers: /bo/admin/dashboard
```

## ⚠️ Important - Sécurité

### 🔴 Règles Critiques
- ❌ **JAMAIS** partager la clé d'accès
- 🔄 Changer les identifiants régulièrement  
- 📝 Vérifier les logs de sécurité quotidiennement
- 🚪 Toujours utiliser "Déconnexion Sécurisée"

### 🌐 Environnement de Production
- [ ] Changer la clé d'accès administrateur
- [ ] Configurer HTTPS obligatoire
- [ ] Mettre en place la surveillance réseau
- [ ] Configurer les alertes email de sécurité
- [ ] Limiter les IP autorisées (optionnel)

## 🔧 Développement vs Production

### Mode Développement (Actuel)
```javascript
// Clé temporaire pour tests
adminKey: "SecureAdmin2024!@#"

// Emails de test acceptés
validEmails: [
  "directeur@ecole-moderne.fr",
  "admin@ecole-moderne.fr"
]
```

### Mode Production (À Configurer)
```javascript
// Variables d'environnement sécurisées
adminKey: process.env.ADMIN_SECRET_KEY
validEmails: process.env.ADMIN_EMAILS.split(',')

// Base de données chiffrée
// Authentification 2FA
// Logs de sécurité centralisés
```

## 📞 Support

En cas de problème d'accès :

1. **Vérifier les logs système**
2. **Contrôler les tentatives bloquées** 
3. **Attendre 15 minutes** si bloqué
4. **Contacter l'équipe technique** si persistant

---

⚡ **Accès Rapide**: https://your-domain.com/bo/admin  
🔐 **Sécurité**: Niveau Enterprise  
📈 **Monitoring**: Temps réel  