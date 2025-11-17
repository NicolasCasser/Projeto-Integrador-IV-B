require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000; 

app.use(cors()); 
app.use(express.json()); 

app.use(express.static(path.resolve(__dirname, '../public')));

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'USUARIO_DB',   
  password: process.env.DB_PASSWORD || 'SENHA_DB', 
  database: process.env.DB_DATABASE || 'nome_do_banco_de_dados',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise(); 

app.get('/alunos', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Alunos ORDER BY id");
    res.json(rows);
  } catch (error) {
    console.error(error); // <--- ADICIONE ESTA LINHA
    res.status(500).json({ erro: error.message });
  }
});

app.get('/alunos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM Alunos WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error); // <--- ADICIONE ESTA LINHA
    res.status(500).json({ erro: error.message });
  }
});

app.post('/alunos', async (req, res) => {
  try {
    const { nome, matricula } = req.body; 
    const [result] = await pool.query(
      "INSERT INTO Alunos (nome, matricula) VALUES (?, ?)",
      [nome, matricula]
    );
    
    const [newAluno] = await pool.query("SELECT * FROM Alunos WHERE id = ?", [result.insertId]);
    res.status(201).json(newAluno[0]);
  } catch (error) {
    console.error(error); // <--- ADICIONE ESTA LINHA
    res.status(500).json({ erro: error.message });
  }
});

app.put('/alunos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, matricula } = req.body; 
    
    await pool.query(
      "UPDATE Alunos SET nome = ?, matricula = ? WHERE id = ?",
      [nome, matricula, id]
    );
    
    const [updatedAluno] = await pool.query("SELECT * FROM Alunos WHERE id = ?", [id]);
    res.json(updatedAluno[0]);
  } catch (error) {
    console.error(error); // <--- ADICIONE ESTA LINHA
    res.status(500).json({ erro: error.message });
  }
});

app.delete('/alunos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM Alunos WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Aluno não encontrado para exclusão" });
    }
    
    res.status(204).send(); 
  } catch (error) {
    console.error(error); 
    res.status(500).json({ erro: error.message });
  }
});

app.get('/', async (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`Servidor back-end rodando em http://localhost:${port}`);
});