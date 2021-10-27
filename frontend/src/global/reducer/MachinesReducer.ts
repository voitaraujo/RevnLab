import {
    MACHINES_DIALOG_STATE,
    MACHINES_LOAD_ALL,
} from "../actions/MachineActionsTypes";

import { IMachinesState } from './MachineReducerTypes'
import { IMachines } from '../../pages/machines/machinesTypes'

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
    Refs: []
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

        default:
            return state;
    }
};
