import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Machines } from '../entity/Machines'
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
        const DLid = req.params.DL

        const verified = <IToken>decryptToken(token!)

        const users = verified && await getRepository(Storages).find({
            where: {
                DLCod: DLid,
                GestorCod: verified.user_code
            }
        })

        if (users.length === 0) {
            return res.status(400).send({
                message: 'Esse DL não está atribuído à você'
            })
        } else {
            const machines = verified && await getRepository(Machines).find({
                select: ['CHAPA', 'SERIE', 'Modelo'],
                where: {
                    DL: DLid,

                }
            })

            machines ? res.status(200).send(machines) : res.status(400).send({
                message: 'Error while querying database'
            })
            return res
        }
    },

    async See(req: Request, res: Response) {
        const token = req.get('Authorization')
        const DLid = req.params.DL
        const Chapa = req.params.CHAPA

        const verified = decryptToken(token!)

        const machines = verified && await getRepository(Machines).find({
            where: {
                DL: DLid,
                CHAPA: Chapa
            }
        })

        machines ? res.status(200).send(machines) : res.status(400).send({
            message: 'Error while querying database'
        })


        return res
    }
}