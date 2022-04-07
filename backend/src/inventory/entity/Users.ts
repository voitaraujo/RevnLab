import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity({ name: 'InvGestor' })
export class Users {
    @PrimaryColumn({
        length: 11,
        type: 'varchar'
    })
    GestorCod!: string;

    @Column({
        length: 60,
        type: 'varchar'
    })
    GestorNome!: string;
    
    @Column({
        length: 4,
        type: 'varchar'
    })
    GestorSenha!: string;
}