-- name: CreateUser :one
INSERT INTO users (name, email, password, role)
VALUES ($1, $2, $3, $4)
RETURNING id, name, email, role, created_at;

-- name: GetUserByEmail :one
SELECT id, name, email, password, role, created_at FROM users WHERE email = $1;

-- name: CountUsersByRole :one
SELECT COUNT(*) FROM users WHERE role = $1;

-- name: CreateFirstAdmin :one
INSERT INTO users (name, email, password, role)
VALUES ($1, $2, $3, 'admin')
RETURNING id, name, email, role, created_at;
