import { Request, Response } from 'express';
import { getRepository, Between } from 'typeorm';
import moment from 'moment'

import { MovStorages } from '../entity/MovStorages'
import { decryptToken } from '../services/jwtAuth'

export default {
    async See(req: Request, res: Response) {
        const token = req.get('Authorization')
        const DLid = req.params.DL

        const verified = decryptToken(token!)

        const products = verified && await getRepository(MovStorages).find({
            where: {
                Refdt: Between(moment().startOf('month').format(), moment().endOf('month').format()),
                DLCod: DLid
            }
        })

        products ? res.status(200).send(products) : res.status(400).send({
            message: 'Error while querying database'
        })


        return res
    },
}