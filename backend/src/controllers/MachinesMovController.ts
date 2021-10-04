import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import moment from 'moment';

import { MovMachines } from '../entity/MovMachines'
import { decryptToken } from '../services/jwtAuth'

interface IToken {
    user_code: string,
    user_name: string,
    role: string,
}

interface IProdutos {
    DLCod: string,
    PROD: string,
    SEL: string,
    PRODUTO: string,
    Qtd: number | string | null,
    Refdt: string,
    Filial: string,
    CHAPA: string
}

interface ReqDTO {
    inventario: IProdutos[],
}

export default {
    async See(req: Request, res: Response) {
        const token = req.get('Authorization')
        const Chapa = req.params.Chapa
        const DLid = req.params.DL
        const Category = req.params.Category
        const Refdt = req.params.Refdt

        const verified = <IToken>decryptToken(token!)

        const products = verified && await getRepository(MovMachines).find({
            select: ['DLCod', 'SEL', 'PRODUTO', 'PROD', 'Qtd', 'Refdt', 'Filial', 'CHAPA'],
            where: {
                CHAPA: Chapa,
                DLCod: DLid,
                GestorCod: verified.user_code,
                Refdt: Refdt
            }
        })

        products ? res.status(200).send(products) : res.status(400).send({
            message: 'Error while querying database'
        })
    },
    async Update(req: Request, res: Response) {
        const token = req.get('Authorization')
        const { inventario }: ReqDTO = req.body

        const verified = decryptToken(token!)

        inventario.forEach(async item =>
            verified && await getConnection()
                .createQueryBuilder()
                .update(MovMachines)
                .set({
                    Qtd: Number(item.Qtd)
                })
                .where("Refdt = :Refdt AND Filial = :Filial AND DLCod = :DL AND CHAPA = :CHAPA AND SEL = :SEL AND PROD = :CodProd",
                 { Refdt: item.Refdt, Filial: item.Filial, DL: item.DLCod, CHAPA: item.CHAPA, SEL: item.SEL, CodProd: item.PROD })
                .execute()
        )

        return res.status(200).send({
            message: 'ok'
        })
    }
}