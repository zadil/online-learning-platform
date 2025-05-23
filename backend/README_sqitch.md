# Sqitch pour les migrations SQL

## Initialisation du projet Sqitch

Dans le dossier `backend/`, exécute :

```sh
sqitch init online-learning-platform --engine pg
```

Cela va créer les fichiers de configuration Sqitch (`sqitch.conf`, `sqitch.plan`).

## Ajouter une migration

```sh
sqitch add users_table -n "Création de la table users"
# Place ton SQL dans migrations/users_table.sql
```

## Déployer les migrations

```sh
sqitch deploy db:pg://postgres:postgres@localhost/online_learning
```

---

Pour plus d’info : https://sqitch.org/docs/manual/sqitchtutorial/
