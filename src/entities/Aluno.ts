import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Aluno {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    nome: string;

    @Column({ unique: true })
    matricula: number;
}