import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Aluno } from "./entities/Aluno";
import { Disciplina } from "./entities/Disciplina";
import { Nota } from "./entities/Nota";

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [Aluno, Disciplina, Nota],
})
