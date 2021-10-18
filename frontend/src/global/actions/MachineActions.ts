import {
  MACHINES_LOAD_DETAILS_INFO,
  MACHINES_DIALOG_STATE,
  MACHINES_LOAD_ALL,
  MACHINES_LOAD_REFS
} from './MachineActionsTypes'

import { IRefs, IMachineDetalhes, IMachines } from '../../pages/machines/machinesTypes'

export const SetMachinesList = (value: IMachines[]): {
  type: string,
  value: IMachines[]
} => ({
  type: MACHINES_LOAD_ALL,
  value: value,
});

export const SetMachineDetails = (value: IMachineDetalhes): {
  type: string,
  value: IMachineDetalhes,
} => {
  return ({
    type: MACHINES_LOAD_DETAILS_INFO,
    value: value,
  })
};

export const SetMachineRefs = (value: IRefs[]): {
  type: string,
  value: IRefs[],
} => {
  return ({
    type: MACHINES_LOAD_REFS,
    value: value,
  })
};

export const SetDialogState = (value: boolean): {
  type: string,
  value: boolean,
} => ({
  type: MACHINES_DIALOG_STATE,
  value: value,
});
