
CREATE DATABASE IF NOT EXISTS recycling_manager_db;
USE recycling_manager_db;

DROP TABLE IF EXISTS rankings;
DROP TABLE IF EXISTS evaluations;
DROP TABLE IF EXISTS candidates;

CREATE TABLE candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    experience INT NOT NULL COMMENT 'Years of experience',
    skills TEXT NOT NULL COMMENT 'Comma-separated skills',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    crisis_management INT NOT NULL COMMENT 'Score 1-10',
    sustainability INT NOT NULL COMMENT 'Score 1-10',
    team_motivation INT NOT NULL COMMENT 'Score 1-10',
    total_score INT GENERATED ALWAYS AS (crisis_management + sustainability + team_motivation) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    UNIQUE KEY unique_candidate_evaluation (candidate_id)
);

CREATE TABLE rankings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    total_score INT NOT NULL,
    rank_position INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    UNIQUE KEY unique_candidate_ranking (candidate_id)
);
CREATE INDEX idx_rank_position ON rankings(rank_position);
CREATE INDEX idx_total_score ON rankings(total_score DESC);