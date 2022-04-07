import { Request, Response } from 'express';
import moment from 'moment'
import { getRepository, createQueryBuilder, getManager } from 'typeorm';

// import { Storages } from '../entity/Storages'
import { MovStorages } from '../entity/MovStorages'
import { MovMachines } from '../entity/MovMachines'
import { decryptToken, IToken } from '../../services/jwtAuth'

interface IFaltaEmDL { DLCod: string, Refdt: string, FaltamProdutos: number }

interface IFaltaEmEQ { Refdt: string, CHAPA: string, Faltam: number }

interface IStoragesCab {
  DLCod: string,
  Filial: string,
  DLNome: string,
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
    const entityManager = getManager();

    const verified = <IToken>decryptToken(token!)
    const mesAnterior = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD hh:mm:ss").replace('12:', '00:')

    const storagesCab = await <Promise<IStoragesCab[]>>entityManager.query(`select distinct ID.DLCod, ID.Filial, ID.DLNome from dbo.InvDL as ID inner join dbo.InvMov as IM on ID.DLCod = IM.DLCod and ID.Filial = IM.Filial where IM.GestorCod = ${verified.supervisor_code} and ID.DLStatus = 'S'`);

    const faltamStorages = await getCurrentMonthStorageMovInfo(mesAnterior)

    let storages: { DLCod: string, DLNome: string, Filial: string, Faltam: number }[] = []

    storagesCab.forEach(storage => {
      let found = false
      for (let i = 0; i < faltamStorages.length; i++) {
        if (storage.DLCod === faltamStorages[i].DLCod) {
          storages.push(Object.assign({ ...storage }, { Faltam: faltamStorages[i].Faltam }))
          found = true
          break
        }
      }
      if (!found) {
        storages.push(Object.assign({ ...storage }, { Faltam: 0 }))
      }
      found = false
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
    const entityManager = getManager();

    const verified = <IToken>decryptToken(token!)

    const storage = await <Promise<IStorageAll[]>>entityManager.query(`select distinct ID.Filial,ID.DLCod,ID.DLQtEq,ID.DLNome,ID.DLEndereco,ID.DLBairro,ID.DLCEP,ID.DLUF,ID.DLMunicipio,ID.DLMunicipioCod,ID.DLStatus,ID.DLLoja from dbo.InvDL as ID inner join dbo.InvMov as IM on ID.DLCod = IM.DLCod and ID.Filial = IM.Filial where IM.GestorCod = ${verified.supervisor_code} and ID.DLStatus = 'S' and ID.DLCod = '${DLid}' and ID.Filial = '${Filial}'`);

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

const getCurrentMonthStorageMovInfo = async (Referencia: string): Promise<{ DLCod: string, Faltam: number }[]> => {
  const RawQuery_MovStorage = getRepository(MovStorages).createQueryBuilder();

  RawQuery_MovStorage.select("DLCod")
    .addSelect("COUNT(PROD)", "Faltam")
    .where(`Qtd IS NULL AND Refdt = convert(smalldatetime, '${Referencia}', 101)`)
    .groupBy("DLCod")
    .orderBy('DLCod', 'DESC');

  const _retorno = await RawQuery_MovStorage.getRawMany<{ DLCod: string, Faltam: number }>()

  return _retorno
}