import { Request, Response } from 'express';
import moment from 'moment'
import { getRepository, createQueryBuilder } from 'typeorm';

import { Storages } from '../entity/Storages'
import { MovStorages } from '../entity/MovStorages'
import { MovMachines } from '../entity/MovMachines'
import { decryptToken } from '../services/jwtAuth'


interface IToken {
    user_code: string,
    user_name: string,
    role: string,
}

interface IFaltaEmDL { DLCod: string, Refdt: string, FaltamProdutos: number }

interface IFaltaEmEQ { Refdt: string, CHAPA: string, Faltam: number }

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

        const ProdsFaltamDL = await getPastStorageMovInfo(Filial, DLid)
        const ProdsFaltamEQ = await getPastStorageMachinesMovInfo(Filial, DLid)

        const completeStorage = storage && storage.length > 0 ? {
            ...storage[0],
            pastMonthsDLInv: ProdsFaltamDL,
            pastMonthsDLEqInv: ProdsFaltamEQ
        } : false

        completeStorage ? res.status(200).send(completeStorage) : res.status(400).send({
            message: 'Error while querying database'
        })

        return res
    }
}

const getPastStorageMovInfo = async (filial: string, DLId: string): Promise<IFaltaEmDL[]> => {
    const RawQuery_MovStorage = getRepository(MovStorages).createQueryBuilder();

    RawQuery_MovStorage.select("DLCod")
        .addSelect("Refdt")
        .addSelect("COUNT(PROD)", "FaltamProdutos")
        .where(`Qtd IS NULL AND Filial = '${filial}' AND DLCod = '${DLId}'`)
        .groupBy("Refdt")
        .addGroupBy("DLCod")
        .addGroupBy("GestorCod")
        .orderBy('Refdt', 'DESC');

    const _retorno = await RawQuery_MovStorage.getRawMany<IFaltaEmDL>()

    return _retorno
}

const getPastStorageMachinesMovInfo = async (filial: string, DLId: string): Promise<{ Ref: string, Eqs: IFaltaEmEQ[] }[]> => {
    const RawQuery_MovEq = getRepository(MovMachines).createQueryBuilder();

    RawQuery_MovEq.select("Refdt")
        .addSelect("CHAPA")
        .addSelect("COUNT(PROD)", "Faltam")
        .where(`Qtd is null and Filial = '${filial}' and DLCod = '${DLId}'`)
        .groupBy("DLCod")
        .addGroupBy("CHAPA")
        .addGroupBy("Refdt")
        .orderBy('Refdt', 'DESC');

    const UnInformedDLEqsProdsQtds = await RawQuery_MovEq.getRawMany<IFaltaEmEQ>()


    let _ref: string[] = []
    let _retorno: { Ref: string, Eqs: IFaltaEmEQ[] }[] = []

    //crio todas as refs em um array pra consultar mais tarde
    UnInformedDLEqsProdsQtds.forEach(EQ => {
        if (_ref.indexOf(moment(EQ.Refdt).toISOString()) === -1) {
            _ref.push(moment(EQ.Refdt).toISOString())
        }
    })

    //crio nessa variavel um protótipo do objeto que eu quero no final
    _ref.forEach(data => {
        _retorno.push({ Ref: moment(data).format('MMMM'), Eqs: [] })
    })

    UnInformedDLEqsProdsQtds.forEach(EQ => {
        _retorno.forEach(data => {
            if (data.Ref === moment(EQ.Refdt).format('MMMM')) {
                data.Eqs.push(EQ)
            }
        })
    })

    return _retorno
}