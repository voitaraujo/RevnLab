import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity({ name: 'InvDL' })
export class Storages {
    @PrimaryColumn({
        length: 4,
        type: 'varchar'
    })
    Filial!: string;

    @PrimaryColumn({
        length: 50,
        type: 'varchar'
    })
    DLCod!: string;

    @Column({
        type: 'int'
    })
    DLQtEq!: number;

    @Column({
        length: 40,
        type: 'varchar'
    })
    DLNome!: string;

    @Column({
        length: 60,
        type: 'varchar'
    })
    DLEndereco!: string;

    @Column({
        length: 20,
        type: 'varchar'
    })
    DLBairro!: string;

    @Column({
        length: 8,
        type: 'varchar'
    })
    DLCEP!: string;

    @Column({
        length: 2,
        type: 'varchar'
    })
    DLUF!: string;
    
    @Column({
        length: 120,
        type: 'varchar'
    })
    DLMunicipio!: string;

    @Column({
        length: 5,
        type: 'varchar'
    })
    DLMunicipioCod!: string;

    @Column({
        length: 1,
        type: 'varchar'
    })
    DLStatus!: string;

    @Column({
        length: 2,
        type: 'varchar'
    })
    DLLoja!: string;
}