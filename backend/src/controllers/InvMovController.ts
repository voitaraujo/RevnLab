import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { decryptToken } from '../services/jwtAuth'
import { InvMov } from '../entity/InvMov'

interface IToken {
    user_code: string,
    user_name: string,
    role: string,
}

export default {
    async See(req: Request, res: Response) {
        const token = req.get('Authorization')
        const DLid = req.params.DL

        const verified = <IToken>decryptToken(token!)

        const Refs = await getRepository(InvMov).find({
            select: ['DLCod', 'Refdt', 'InvMovSeq', 'InvMovStaus'],
            where: {
                GestorCod: verified.user_code,
                DLCod: DLid,
                InvMovStaus: 0,
            }
        })

        Refs ? res.status(200).send({ Refs }) : res.status(400).send({
            message: 'Error while querying database'
        })

        return res
    }
}