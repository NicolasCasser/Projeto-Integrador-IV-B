import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Disciplina {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    professor: string;
}