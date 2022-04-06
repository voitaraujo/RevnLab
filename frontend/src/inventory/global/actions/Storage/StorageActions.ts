import {
  STORAGES_LOAD_ALL,
  STORAGES_DIALOG_STATE,
  STORAGES_LOAD_DETAILS_INFO,
  STORAGES_LOAD_REFS,
  STORAGES_LOAD_PRODUTOS
} from './StorageActionsTypes'

import { 
  IRefs, 
  IDepositos,
  IDepositoDetalhes,
  IDepositoInventario
} from '../../../pages/storages/storageTypes'

export const SetStoragesList = (value: IDepositos[]): {
  type: string,
  value: IDepositos[]
} => ({
  type: STORAGES_LOAD_ALL,
  value: value,
});

export const SetStorageDetails = (value: IDepositoDetalhes): {
  type: string,
  value: IDepositoDetalhes,
} => {
  return ({
    type: STORAGES_LOAD_DETAILS_INFO,
    value: value,
  })
};

export const SetStorageRefs = (value: IRefs[]): {
  type: string,
  value: IRefs[],
} => {
  return ({
    type: STORAGES_LOAD_REFS,
    value: value,
  })
};

export const SetDialogState = (value: boolean): {
  type: string,
  value: boolean,
} => ({
  type: STORAGES_DIALOG_STATE,
  value: value,
});

export const SetProdutos = (value: IDepositoInventario[]): {
  type: string,
  value: IDepositoInventario[],
} => ({
  type: STORAGES_LOAD_PRODUTOS,
  value: value,
});
