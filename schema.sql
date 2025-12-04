CREATE DATABASE IF NOT EXISTS alunos_db;

USE alunos_db;

CREATE TABLE IF NOT EXISTS Alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    matricula VARCHAR(20) UNIQUE NOT NULL
);

INSERT INTO Alunos (nome, matricula) VALUES
('Ana Silva', '2025001'),
('Bruno Costa', '2025002')
ON DUPLICATE KEY UPDATE nome=nome; 