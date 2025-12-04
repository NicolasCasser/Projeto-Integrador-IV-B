import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import path from 'path';
import { AppDataSource } from './data-source';
import { Aluno } from './entities/Aluno';
import { Disciplina } from "./entities/Disciplina";
import { Nota } from "./entities/Nota";
import { Status } from "./enums/status.enum";
import mysql from 'mysql2/promise';
import { validate } from "class-validator";

// Função para calcular média e status de aprovação de um aluno
function calcularStatus(n1: number, n2: number) {
    const media = (n1 + n2) / 2;
    let status: Status;

    if (media >= 7) {
        status = Status.APROVADO;
    } else if (media >= 4) {
        status = Status.RECUPERACAO;
    } else {
        status = Status.REPROVADO;
    }

    return { media, status };
}

const app = express();
const port = 3001; 

app.use(cors()); 
app.use(express.json()); 

app.use(express.static(path.join(process.cwd(), 'public')));


// API

app.get('/alunos', async (req, res) => {
    try {
        const alunoRepo = AppDataSource.getRepository(Aluno);
        const alunos = await alunoRepo.find({ order: { id: "ASC" } });
        res.json(alunos);
    } catch (error: any) {
        res.status(500).json({ erro: error.message });
    }
});

app.get('/alunos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const alunoRepo = AppDataSource.getRepository(Aluno);

        const aluno = await alunoRepo.findOneBy({ id: parseInt(id) });

        if (!aluno)
            return res.status(404).json({ erro: "Aluno não encontrado" });

        res.json(aluno);
    } catch (error: any) {
        res.status(500).json({ erro: error.message });
    }
});

app.post('/alunos', async (req, res) => {
    try {
        const { nome, matricula } = req.body;
        const alunoRepo = AppDataSource.getRepository(Aluno);

        const alunoExistente = await alunoRepo.findOneBy({ matricula });
        if (alunoExistente) {
            return res.status(400).json({ erro: "Matrícula já cadastrada" });
        }

        const novoAluno = alunoRepo.create({ nome, matricula });
        const resultado = await alunoRepo.save(novoAluno);

        res.status(201).json(resultado);
    } catch (error: any) {
        res.status(500).json({ erro: error.message });
    }
});

app.put('/alunos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, matricula } = req.body;
        const repo = AppDataSource.getRepository(Aluno);

        const aluno = await repo.findOneBy({ id: parseInt(id) });
        if (!aluno) return res.status(404).json({ erro: "Aluno não encontrado" });

        if (matricula && matricula !== aluno.matricula) {
            const duplicado = await repo.findOneBy({ matricula });
            if (duplicado) return res.status(400).json({ erro: "Matrícula já cadastrada" });
        }

        repo.merge(aluno, { nome: nome || aluno.nome, matricula: matricula || aluno.matricula });
        const resultado = await repo.save(aluno);

        res.json(resultado);
    } catch (error: any) {
        res.status(500).json({ erro: error.message });
    }
});

app.delete('/alunos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const alunoRepo = AppDataSource.getRepository(Aluno);
        
        const resultado = await alunoRepo.delete(id);
        
        if (resultado.affected === 0) {
            return res.status(404).json({ erro: "Aluno não encontrado" });
        }
        
        res.status(200).json({ message: "Aluno excluído com sucesso!" });
    } catch (error: any) {
        res.status(500).json({ erro: error.message });
    }
});

app.post('/disciplinas', async (req, res) => {
    try {
        const { nome, professor } = req.body;
        const repo = AppDataSource.getRepository(Disciplina);
        const disciplina = repo.create({ nome, professor });
        await repo.save(disciplina);
        res.status(201).json(disciplina);
    } catch (error: any) {
        res.status(500).json({ erro: error.message });
    }
});

app.get('/disciplinas', async (req, res) => {
    const repo = AppDataSource.getRepository(Disciplina);
    const disciplinas = await repo.find();
    res.json(disciplinas);
});

app.put('/disciplinas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, professor } = req.body;
        const repo = AppDataSource.getRepository(Disciplina);

        const disciplina = await repo.findOneBy({ id: parseInt(id) });

        if (!disciplina) return res.status(404).json({ erro: "Disciplina não encontrada" });

        const novoNome = nome !== undefined ? nome : disciplina.nome;
        const novoProf = professor !== undefined ? professor : disciplina.professor;

        repo.merge(disciplina, { 
            nome: novoNome, 
            professor: novoProf 
        });
        
        const resultado = await repo.save(disciplina);
        res.json(resultado);
    } catch (error: any) {
        res.status(500).json({ erro: error.message });
    }
});

app.delete('/disciplinas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const repo = AppDataSource.getRepository(Disciplina);

        const resultado = await repo.delete(id);

        if (resultado.affected === 0) {
            return res.status(404).json({ erro: 'Disciplina não encontrada' });
        }

        res.status(200).json({ message: "Disciplina excluída com sucesso!" });
    } catch (error: any) {
        res.status(500).json({ erro: error.message });
    }
});

app.post('/notas', async (req, res) => {
     try {
        const { alunoId, disciplinaId, nota1, nota2 } = req.body;

        const n1 = parseFloat(nota1);
        const n2 = parseFloat(nota2);

        const { media, status } = calcularStatus(n1, n2);

        const notaRepo = AppDataSource.getRepository(Nota);

        const novaNota = notaRepo.create({
            nota1: n1,
            nota2: n2,
            media,
            status,
            aluno: { id: alunoId },
            disciplina: { id: disciplinaId }
        });

        const errors = await validate(novaNota);
        if (errors.length > 0) {
            return res.status(400).json({
                erro: "Dados de nota inválidos.",
                detalhes: errors
            });
        }

        await notaRepo.save(novaNota);
        return res.status(201).json(novaNota);

    } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062 || error.code === '1062') {
      return res.status(400).json({
        erro: "Este aluno já possui notas cadastradas para esta disciplina."
      });
    }

        res.status(500).json({ erro: error.message });
    }
});

app.get('/notas', async (req, res) => {
    try {
        const notaRepo = AppDataSource.getRepository(Nota);
        // Busca notas carregando os dados do Aluno e da Disciplina
        const notas = await notaRepo.find({
            relations: {
                aluno: true,
                disciplina: true
            }
        });
        res.json(notas);
    } catch (error: any) {
        res.status(500).json({ erro: error.message });
    }
});

app.get('/notas/aluno/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const notaRepo = AppDataSource.getRepository(Nota);

        const notas = await notaRepo.find({
            where: { aluno: { id: parseInt(id) } },
            relations: { aluno: true, disciplina: true },
            order: { id: "ASC" }
        });

        res.json(notas);
    } catch (error: any) {
        res.status(500).json({ erro: error.message });
    }
});

app.put('/notas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nota1, nota2 } = req.body;

        const repo = AppDataSource.getRepository(Nota);
        const nota = await repo.findOneBy({ id: parseInt(id) });

        if (!nota) {
            return res.status(404).json({ erro: 'Nota não encontrada' });
        }

        const n1 = nota1 !== undefined ? Number(nota1) : Number(nota.nota1);
        const n2 = nota2 !== undefined ? Number(nota2) : Number(nota.nota2);

        const { media, status } = calcularStatus(n1, n2);

        repo.merge(nota, {
            nota1: n1,
            nota2: n2,
            media,
            status
        });

        const errors = await validate(nota);
        if (errors.length > 0) {
            return res.status(400).json({
                erro: "Dados inválidos",
                detalhes: errors
            });
        }

        const resultado = await repo.save(nota);
        res.json(resultado);

    } catch (error: any) {
        res.status(500).json({ erro: error.message });
    }
});

app.delete('/notas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const repo = AppDataSource.getRepository(Nota);

        const resultado = await repo.delete(id);

        if (resultado.affected === 0) {
            return res.status(404).json({ erro: 'Nota não encontrada' });
        }

        res.status(200).json({ message: "Nota excluída com sucesso!" });
    } catch (error: any) {
        res.status(500).json({ erro: error})
    }
})

const startServer = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\``);
        await connection.end(); 

        console.log(`Banco '${process.env.DB_DATABASE}' verificado/criado com sucesso.`);

        await AppDataSource.initialize();
        console.log("Banco de dados conectado via TypeORM (TypeScript)!");

        app.listen(port, () => {
            console.log(`Servidor TS rodando em http://localhost:${port}`);
        });

    } catch (error) {
        console.error("Erro fatal ao iniciar o servidor:", error);
    }
};

startServer();