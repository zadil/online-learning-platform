-- name: ListCourses :many
SELECT id, title, description, created_at, updated_at, author_id
FROM courses
ORDER BY created_at DESC;

-- name: CreateCourse :one
INSERT INTO courses (title, description, author_id)
VALUES ($1, $2, $3)
RETURNING id, title, description, created_at, updated_at, author_id;
