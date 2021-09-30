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
    async Show(req: Request, res: Response) {
        const token = req.get('Authorization')
        const DLid = req.params.DL

        const verified = <IToken>decryptToken(token!)

        const RefsDisponiveis = await getRepository(InvMov).find({
            where: {
                GestorCod: verified.user_code,
                DLCod: DLid,
                InvMovStaus: 0,
            }
        })

        return res
    }
}