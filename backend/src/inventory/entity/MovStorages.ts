import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity({ name: 'InvDLMov' })
export class MovStorages {
    @PrimaryColumn({
        type: 'date'
    })
    Refdt!: string;

    @PrimaryColumn({
        length: 4,
        type: 'varchar'
    })
    Filial!: string;

    @PrimaryColumn({
        length: 3,
        type: 'varchar'
    })
    DLCod!: string;

    @PrimaryColumn({
        length: 15,
        type: 'varchar'
    })
    PROD!: string;

    @Column({
        length: 100,
        type: 'varchar'
    })
    PRODUTO!: string;

    @Column({
        type: 'decimal'
    })
    Qtd!: number;

    @Column({
        type: 'varchar',
        length: 1
    })
    Tipo!: string;

    @Column({
        type: 'smalldatetime'
    })
    lastupdate!: Date;
}