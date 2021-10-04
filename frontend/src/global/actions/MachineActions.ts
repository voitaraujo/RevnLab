import {
  MACHINES_LOAD_DETAILS_INFO,
  MACHINES_DIALOG_STATE,
  MACHINES_LOAD_ALL,
  MACHINES_LOAD_REFS
} from './MachineActionsTypes'

import { IDetalhes, IMachines, IRefs } from '../reducer/MachineReducerInterfaces'

export const SetMachinesList = (value: IMachines[]) => ({
  type: MACHINES_LOAD_ALL,
  value: value,
});

export const SetMachineDetails = (value: IDetalhes) => {
  return ({
    type: MACHINES_LOAD_DETAILS_INFO,
    value: value,
  })
};

export const SetMachineRefs = (value: IRefs[]) => {
  return ({
    type: MACHINES_LOAD_REFS,
    value: value,
  })
};

export const SetDialogState = (value: boolean) => ({
  type: MACHINES_DIALOG_STATE,
  value: value,
});
