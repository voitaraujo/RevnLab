import {
  STORAGES_DIALOG_STATE,
  STORAGES_LOAD_ALL,
  STORAGES_LOAD_DETAILS_INFO,
  STORAGES_LOAD_PRODUTOS,
  STORAGES_LOAD_REFS
} from "../../actions/Storage/StorageActionsTypes";

import { IStoragesState } from './StoragesReducerTypes'
import { IDepositos, IDepositoDetalhes, IDepositoInventario, IRefs } from '../../../pages/storages/storageTypes'

const initialState: IStoragesState = {
  DialogState: false,
  FullscreenDialogState: false,
  Storages: [],
  StorageDetails: {
    Filial: '',
    DLCod: '',
    DLQtEq: 0,
    DLNome: '',
    DLEndereco: '',
    DLBairro: '',
    DLCEP: '',
    DLUF: '',
    DLMunicipio: '',
    DLMunicipioCod: '',
    DLStatus: '',
    DLLoja: '',
    pastMonthsDLInv: [],
    pastMonthsDLEqInv: []
  },
  Refs: [],
  Produtos: []
};

export const StoragesReducer = (state = initialState, action: { type: string, value: any }): IStoragesState => {
  switch (action.type) {
    case STORAGES_DIALOG_STATE:
      return {
        ...state,
        DialogState: action.value as boolean,
      };

    case STORAGES_LOAD_ALL:
      return {
        ...state,
        Storages: action.value as IDepositos[],
      };

    case STORAGES_LOAD_DETAILS_INFO:
      return {
        ...state,
        StorageDetails: action.value as IDepositoDetalhes,
      };

    case STORAGES_LOAD_PRODUTOS:
      return {
        ...state,
        Produtos: action.value as IDepositoInventario[],
      };

    case STORAGES_LOAD_REFS:
      return {
        ...state,
        Refs: action.value as IRefs[],
      };

    default:
      return state;
  }
};
