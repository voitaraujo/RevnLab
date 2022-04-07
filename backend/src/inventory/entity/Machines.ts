import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity({ name: 'InvEquipamentos' })
export class Machines {
    @PrimaryColumn({
        length: 4,
        type: 'varchar'
    })
    N1_ZZFILIA!: string;

    @PrimaryColumn({
        length: 20,
        type: 'varchar'
    })
    CHAPA!: string;

    @Column({
        length: 20,
        type: 'varchar'
    })
    SERIE!: string;
    
    @Column({
        length: 6,
        type: 'varchar'
    })
    CLICOD!: string;

    @Column({
        length: 2,
        type: 'varchar'
    })
    CLILJ!: string;

    @Column({
        length: 3,
        type: 'varchar'
    })
    DL!: string;

    @Column({
        length: 40,
        type: 'varchar'
    })
    Modelo!: string;
}