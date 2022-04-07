import { Request, Response } from 'express';
import moment from 'moment'
import { getRepository, createQueryBuilder, getManager } from 'typeorm';

import { Machines } from '../entity/Machines'
import { MovMachines } from '../entity/MovMachines'
// import { Storages } from '../entity/Storages'
import { decryptToken, IToken } from '../../services/jwtAuth'

interface IFaltaEmEq {
  Refdt: string,
  CHAPA: string,
  Faltam: number
}

interface IStorageAll {
  Filial: string
  DLCod: string
  DLQtEq: number
  DLNome: string
  DLEndereco: string
  DLBairro: string
  DLCEP: string
  DLUF: string
  DLMunicipio: string
  DLMunicipioCod: string
  DLStatus: string
  DLLoja: string
}

export default {
  async Show(req: Request, res: Response) {
    const token = req.get('Authorization')
    const DLid = req.params.DL
    const entityManager = getManager();

    const verified = <IToken>decryptToken(token!)
    const mesAnterior = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD hh:mm:ss").replace('12:', '00:')

    const users = await <Promise<IStorageAll[]>>entityManager.query(`select distinct ID.Filial,ID.DLCod,ID.DLQtEq,ID.DLNome,ID.DLEndereco,ID.DLBairro,ID.DLCEP,ID.DLUF,ID.DLMunicipio,ID.DLMunicipioCod,ID.DLStatus,ID.DLLoja from dbo.InvDL as ID inner join dbo.InvMov as IM on ID.DLCod = IM.DLCod and ID.Filial = IM.Filial where IM.GestorCod = ${verified.supervisor_code} and ID.DLStatus = 'S' and ID.DLCod = '${DLid}'`);

    if (users.length === 0) {
      return res.status(400).send({
        message: 'Esse DL não está atribuído à você'
      })
    } else {
      const machinesCab = verified && await getRepository(Machines).find({
        select: ['CHAPA', 'SERIE', 'Modelo'],
        where: {
          DL: DLid,
        }
      })

      const faltamMachines = await getCurrentMonthMachinesMovInfo(DLid, mesAnterior)

      let machines: { CHAPA: string, SERIE: string, Modelo: string, Faltam: number }[] = []

      machinesCab.forEach(machine => {
        let found = false
        for (let i = 0; i < faltamMachines.length; i++) {
          if (machine.CHAPA === faltamMachines[i].CHAPA) {
            machines.push(Object.assign({ ...machine }, { Faltam: faltamMachines[i].Faltam }))
            found = true
            break
          }
        }
        if (!found) {
          machines.push(Object.assign({ ...machine }, { Faltam: 0 }))
        }
        found = false
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
    const entityManager = getManager();

    const verified = <IToken>decryptToken(token!)

    const users = await <Promise<IStorageAll[]>>entityManager.query(`select distinct ID.Filial,ID.DLCod,ID.DLQtEq,ID.DLNome,ID.DLEndereco,ID.DLBairro,ID.DLCEP,ID.DLUF,ID.DLMunicipio,ID.DLMunicipioCod,ID.DLStatus,ID.DLLoja from dbo.InvDL as ID inner join dbo.InvMov as IM on ID.DLCod = IM.DLCod and ID.Filial = IM.Filial where IM.GestorCod = ${verified.supervisor_code} and ID.DLStatus = 'S' and ID.DLCod = '${DLid}'`);

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

      const ProdsFaltamEQ = await getPastStorageMovInfo(Chapa, DLid)

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

const getPastStorageMovInfo = async (CHAPA: string, DLId: string): Promise<IFaltaEmEq[]> => {
  const RawQuery_MovStorage = getRepository(MovMachines).createQueryBuilder();

  RawQuery_MovStorage.select("Refdt")
    .addSelect("CHAPA")
    .addSelect("COUNT(PROD)", "Faltam")
    .where(`Qtd IS NULL AND DLCod = '${DLId}' AND CHAPA = '${CHAPA}'`)
    .groupBy("Refdt")
    .addGroupBy("CHAPA")
    .orderBy('Refdt', 'DESC');

  const _retorno = await RawQuery_MovStorage.getRawMany<IFaltaEmEq>()

  return _retorno
}

const getCurrentMonthMachinesMovInfo = async (DLId: string, Referencia: string): Promise<{ CHAPA: string, Faltam: number }[]> => {
  const RawQuery_MovStorage = getRepository(MovMachines).createQueryBuilder();

  RawQuery_MovStorage.select("CHAPA")
    .addSelect("COUNT(SEL)", "Faltam")
    .where(`Qtd IS NULL AND DLCod = '${DLId}' AND Refdt = convert(smalldatetime, '${Referencia}', 101)`)
    .groupBy("CHAPA")
    .orderBy('CHAPA', 'DESC');

  const _retorno = await RawQuery_MovStorage.getRawMany<{ CHAPA: string, Faltam: number }>()

  return _retorno
}