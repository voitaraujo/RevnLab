import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity({ name: 'InvEqMov' })
export class MovMachines {
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
        length: 20,
        type: 'varchar'
    })
    CHAPA!: string;

    @PrimaryColumn({
        length: 3,
        type: 'varchar'
    })
    SEL!: string;

    @Column({
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
        type: 'smalldatetime'
    })
    lastupdate!: Date;
}