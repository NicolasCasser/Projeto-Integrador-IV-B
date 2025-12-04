import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Aluno } from "./Aluno";
import { Disciplina } from "./Disciplina";
import { Status } from "../enums/status.enum";


@Entity()
export class Nota {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 5, scale: 2})
    nota1: number;

    @Column('decimal', { precision: 5, scale: 2})
    nota2: number;

    @Column('decimal', { precision: 5, scale: 2})
    media: number;

    @Column({ type: 'enum', enum: Status })
    status: Status;

    // Muitas notas pertencem a um aluno
    @ManyToOne(() => Aluno, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'aluno_id' })
    aluno: Aluno

    // Muitas notas pertencem a uma disciplina
    @ManyToOne(() => Disciplina, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'disciplina_id' })
    disciplina: Disciplina;
}