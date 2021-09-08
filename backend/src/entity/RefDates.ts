import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity({ name: 'Referencia' })
export class RefDates {
    @PrimaryColumn({
        type: 'date'
    })
    Refdt!: string;

    @Column({
        type: 'int'
    })
    RefAno!: number;

    @Column({
        type: 'int'
    })
    RefMes!: number;

    @Column({
        type: 'date'
    })
    RefUdMesAnt!: string;

    @Column({
        type: 'date'
    })
    RefUd!: string;

    @Column({
        type: 'date'
    })
    RefPdt!: string;

    @Column({
        type: 'date'
    })
    RefAnt!: string;

    @Column({
        type: 'date'
    })
    RefProx!: string;

    @Column({
        type: 'bit'
    })
    flgFechCafe!: boolean;

    @Column({
        type: 'bit'
    })
    flgFechSnack!: boolean;

    @Column({
        type: 'decimal'
    })
    Roy8005!: number;

    @Column({
        type: 'decimal'
    })
    Roy8006!: number;

    @Column({
        type: 'decimal'
    })
    Roy8008!: number;
}