import { Request, Response } from 'express';
import { getRepository, Between } from 'typeorm';
import moment from 'moment';

import { MovMachines } from '../entity/MovMachines'
import { decryptToken } from '../services/jwtAuth'

interface IToken {
    user_code: string,
    user_name: string,
    role: string,
}

export default {
    async See(req: Request, res: Response) {
        const token = req.get('Authorization')
        const Chapa = req.params.Chapa
        const DLid = req.params.DL

        const verified = <IToken>decryptToken(token!)

        const products = verified && await getRepository(MovMachines).find({
            select: ['DLCod', 'SEL', 'PRODUTO', 'PROD', 'Qtd'],
            where: {
                CHAPA: Chapa,
                DLCod: DLid,
                GestorCod: verified.user_code,
                Refdt: Between(new Date(moment().startOf('month').format()), new Date(moment().endOf('month').format()))
            }
        })

        products ? res.status(200).send(products) : res.status(400).send({
            message: 'Error while querying database'
        })
    }
}