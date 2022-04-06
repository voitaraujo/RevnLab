import {
  MACHINES_DIALOG_STATE,
  MACHINES_LOAD_ALL,
  MACHINES_LOAD_DETAILS_INFO,
  MACHINES_LOAD_PRODUTOS,
  MACHINES_LOAD_REFS
} from "../../actions/Machine/MachineActionsTypes";

import { IMachinesState } from './MachineReducerTypes'
import { IMachines, IMachineDetalhes, IProdutoInventário, IMachineRefs } from '../../../pages/machines/machinesTypes'

const initialState: IMachinesState = {
  DialogState: false,
  FullscreenDialogState: false,
  Machines: [],
  MachineDetails: {
    CHAPA: '',
    CLICOD: '',
    CLILJ: '',
    DL: '',
    Modelo: '',
    N1_ZZFILIA: '',
    SERIE: '',
    pastMonthsEqInv: []
  },
  Refs: [],
  Produtos: []
};

export const MachinesReducer = (state = initialState, action: { type: string, value: any }): IMachinesState => {
  switch (action.type) {
    case MACHINES_DIALOG_STATE:
      return {
        ...state,
        DialogState: action.value as boolean,
      };

    case MACHINES_LOAD_ALL:
      return {
        ...state,
        Machines: action.value as IMachines[],
      };

    case MACHINES_LOAD_DETAILS_INFO:
      return {
        ...state,
        MachineDetails: action.value as IMachineDetalhes,
      };

    case MACHINES_LOAD_PRODUTOS:
      return {
        ...state,
        Produtos: action.value as IProdutoInventário[],
      };

    case MACHINES_LOAD_REFS:
      return {
        ...state,
        Refs: action.value as IMachineRefs[],
      };

    default:
      return state;
  }
};
