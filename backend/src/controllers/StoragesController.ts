import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Storages } from '../entity/Storages'
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

        storages ? res.status(200).send(storages) : res.status(400).send({
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

        storage ? res.status(200).send(storage) : res.status(400).send({
            message: 'Error while querying database'
        })


        return res
    }
}