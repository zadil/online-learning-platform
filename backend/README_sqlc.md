# sqlc pour la génération de code Go

## Installation

```sh
brew install sqlc
```

## Génération du code Go

Dans le dossier `backend/` :

```sh
sqlc generate
```

- Les requêtes SQL sont dans `queries/`
- Les schémas SQL sont dans `migrations/`
- Le code Go généré sera dans `internal/db/`

Voir le fichier `sqlc.yaml` pour la configuration.

---

Documentation officielle : https://docs.sqlc.dev/en/stable/
