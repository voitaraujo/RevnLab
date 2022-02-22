import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity({ name: 'InvMov' })
export class InvMov {
    @PrimaryColumn({
        type: 'datetime'
    })
    Refdt!: string;

    @PrimaryColumn({
        type: 'varchar',
        length: 11,
    })
    GestorCod!: string;

    @PrimaryColumn({
        type: 'varchar',
        length: 10,
    })
    Filial!: string;

    @PrimaryColumn({
        type: 'varchar',
        length: 50,
    })
    DLCod!: string;

    @Column({
        type: 'int'
    })
    InvMovSeq!: number;

    @Column({
        type: 'varchar',
        length: 1,
    })
    InvMovStatus!: string;
}