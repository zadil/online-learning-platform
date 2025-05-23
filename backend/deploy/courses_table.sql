-- Migration pour la table courses
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    author_id INTEGER REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_courses_author_id ON courses(author_id);
