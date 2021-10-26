import { Request, Response } from 'express';
import { getRepository, createQueryBuilder } from 'typeorm';

import { Storages } from '../entity/Storages'
import { MovStorages } from '../entity/MovStorages'
import { decryptToken } from '../services/jwtAuth'


interface IToken {
    user_code: string,
    user_name: string,
    role: string,
}

export default {
    async Show(req: Request, res: Response) {
        const token = req.get('Authorization')

        const verified = <IToken>decryptToken(token!)

        const storages = verified && await getRepository(Storages).find({
            select: ['DLCod', 'DLNome', 'Filial'],
            where: {
                GestorCod: verified.user_code
            }
        })

        storages ? res.status(200).send({ storages }) : res.status(400).send({
            message: 'Error while querying database'
        })

        return res
    },

    async See(req: Request, res: Response) {
        const token = req.get('Authorization')
        const DLid = req.params.DL
        const Filial = req.params.Filial

        const verified = <IToken>decryptToken(token!)

        const storage = verified && await getRepository(Storages).find({
            where: {
                GestorCod: verified.user_code,
                DLCod: DLid,
                Filial: Filial
            }
        })

        const ProdsFaltam = await getLastMovProdsInfo(Filial, DLid)

        const completeStorage = storage ? { ...storage[0], pastMonthsInv: ProdsFaltam } : null

        completeStorage ? res.status(200).send(completeStorage) : res.status(400).send({
            message: 'Error while querying database'
        })

        return res
    }
}

const getLastMovProdsInfo = async (filial: string, DLId: string) => {
    const RawQuery = getRepository(MovStorages).createQueryBuilder();

    RawQuery.select("DLCod")
        .addSelect("Refdt")
        .addSelect("COUNT(PROD)", "FaltamProdutos")
        .where(`Qtd IS NULL AND Filial = '${filial}' AND DLCod = '${DLId}'`)
        .groupBy("Refdt")
        .addGroupBy("DLCod")
        .addGroupBy("GestorCod")
        .orderBy('Refdt', 'DESC');

    const UninformedProdsQtds = await RawQuery.getRawMany<{ DLCod: string, Refdt: string, FaltamProdutos: number }>()

    return UninformedProdsQtds
}