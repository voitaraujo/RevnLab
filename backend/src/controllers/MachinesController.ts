import { Request, Response } from 'express';
import { getRepository, createQueryBuilder } from 'typeorm';

import { Machines } from '../entity/Machines'
import { MovMachines } from '../entity/MovMachines'
import { Storages } from '../entity/Storages'
import { decryptToken } from '../services/jwtAuth'

interface IToken {
    user_code: string,
    user_name: string,
    role: string,
}

interface IFaltaEmEq {
    Refdt: string,
    CHAPA: string,
    Faltam: number
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

            machines ? res.status(200).send({ machines }) : res.status(400).send({
                message: 'Error while querying database'
            })
            return res
        }
    },

    async See(req: Request, res: Response) {
        const token = req.get('Authorization')
        const DLid = req.params.DL
        const Chapa = req.params.CHAPA

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
                where: {
                    DL: DLid,
                    CHAPA: Chapa,

                }
            })

            const ProdsFaltamEQ = await getPastStorageMovInfo(Chapa, DLid, verified.user_code)

            const completeStorage = machines && machines.length > 0 ? {
                ...machines[0],
                pastMonthsEqInv: ProdsFaltamEQ
            } : false

            completeStorage ? res.status(200).send(completeStorage) : res.status(400).send({
                message: 'Error while querying database'
            })
        }

        return res
    }
}

const getPastStorageMovInfo = async (CHAPA: string, DLId: string, GestorCod: string): Promise<IFaltaEmEq[]> => {
    const RawQuery_MovStorage = getRepository(MovMachines).createQueryBuilder();

    RawQuery_MovStorage.select("Refdt")
        .addSelect("CHAPA")
        .addSelect("COUNT(PROD)", "Faltam")
        .where(`Qtd IS NULL AND DLCod = '${DLId}' AND CHAPA = '${CHAPA}' AND GestorCod = '${GestorCod}'`)
        .groupBy("Refdt")
        .addGroupBy("CHAPA")
        .orderBy('Refdt', 'DESC');

    const _retorno = await RawQuery_MovStorage.getRawMany<IFaltaEmEq>()

    return _retorno
}