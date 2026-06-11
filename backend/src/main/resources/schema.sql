CREATE TABLE IF NOT EXISTS profiles(
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS notes(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    content TEXT default '',
    category VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks(
    id BIGSERIAL PRIMARY KEY,
    note_id BIGINT REFERENCES notes(id) ON DELETE SET NULL,
    user_id BIGINT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    position INT NOT NULL DEFAULT 0,
    urgency_tier VARCHAR(20) NOT NULL CHECK (urgency_tier IN ('IMPACTFUL', 'IMPORTANT', 'HEAVY', 'MEDIUM', 'LIGHT')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('TODO', 'PROGRESS', 'REVIEW', 'DONE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
