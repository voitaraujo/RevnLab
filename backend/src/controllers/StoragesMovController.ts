import { Request, Response } from 'express';
import { getRepository, Between, getConnection } from 'typeorm';

import { MovStorages } from '../entity/MovStorages'
import { decryptToken } from '../services/jwtAuth'

interface IProdutos {
    Refdt: string;
    Filial: string;
    DLCod: string;
    PROD: string;
    PRODUTO: string;
    Qtd: number | string;
}

interface ReqDTO {
    inventario: IProdutos[],
}

export default {
    async See(req: Request, res: Response) {
        const token = req.get('Authorization')
        const DLid = req.params.DL
        const Filial = req.params.FILIAL
        const PD = req.params.PD
        const UD = req.params.UD

        const verified = decryptToken(token!)

        const products = verified && await getRepository(MovStorages).find({
            select: ['DLCod', 'Filial', 'PROD', 'PRODUTO', 'Refdt', 'Qtd'],
            where: {
                Refdt: Between(new Date(PD), new Date(UD)),
                DLCod: DLid,
                Filial: Filial
            }
        })

        products ? res.status(200).send(products) : res.status(400).send({
            message: 'Error while querying database'
        })


        return res
    },

    async Update(req: Request, res: Response) {
        const token = req.get('Authorization')
        const { inventario }: ReqDTO = req.body

        const verified = decryptToken(token!)

        inventario.forEach(async item =>
            verified && await getConnection()
                .createQueryBuilder()
                .update(MovStorages)
                .set({
                    Qtd: Number(item.Qtd)
                })
                .where("Refdt = :Refdt AND DLCod = :DLCod AND Filial = :Filial AND PROD = :PROD", { Refdt: item.Refdt, DLCod: item.DLCod, Filial: item.Filial, PROD: item.PROD })
                .execute()
        )

        return res.status(200).send({
            message: 'ok'
        })
    }
}