import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import moment from 'moment';

import { MovMachines } from '../entity/MovMachines'
import { decryptToken, IToken } from '../../services/jwtAuth'

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
        /* Atualmente o tipo de produtos está fixado em SNACKS no frontend,
        tambem não preciso usar ele para nada, mas caso precise, está aqui */
        const Category = req.params.Category
        const Refdt = req.params.Refdt

        const verified = <IToken>decryptToken(token!)

        const products = verified && await getRepository(MovMachines).find({
            select: ['DLCod', 'SEL', 'PRODUTO', 'PROD', 'Qtd', 'Refdt', 'Filial', 'CHAPA'],
            where: {
                Refdt: Refdt,
                DLCod: DLid,
                CHAPA: Chapa,
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
                    Qtd: item.Qtd === null ? undefined : Number(item.Qtd),
                    lastupdate: new Date()
                })
                .where("Refdt = :Refdt AND Filial = :Filial AND DLCod = :DL AND CHAPA = :CHAPA AND SEL = :SEL AND PROD = :CodProd",
                    { Refdt: item.Refdt, Filial: item.Filial, DL: item.DLCod, CHAPA: item.CHAPA, SEL: item.SEL, CodProd: item.PROD })
                .execute()
        )

        return res.status(200).send({
            message: 'ok'
        })
    },

    async UpdateOne(req: Request, res: Response) {
        const token = req.get('Authorization')
        const { Line }: { Line: IProdutos } = req.body

        const verified = decryptToken(token!)

        verified && await getConnection()
            .createQueryBuilder()
            .update(MovMachines)
            .set({
                Qtd: Number(Line.Qtd),
                lastupdate: new Date()
            })
            .where(
                "Refdt = :Refdt AND Filial = :Filial AND DLCod = :DL AND CHAPA = :CHAPA AND SEL = :SEL AND PROD = :CodProd",
                { Refdt: Line.Refdt, Filial: Line.Filial, DL: Line.DLCod, CHAPA: Line.CHAPA, SEL: Line.SEL, CodProd: Line.PROD }
            )
            .execute()

        return res.status(200).send({
            message: 'ok'
        })
    }
}