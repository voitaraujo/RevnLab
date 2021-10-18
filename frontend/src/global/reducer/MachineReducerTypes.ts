import { IMachineDetalhes, IRefs, IMachines } from '../../pages/machines/machinesTypes'

export interface IMachinesActions {
    SetMachineDetails: (value: IMachineDetalhes) => void,
    SetDialogState: (value: boolean) => void,
    SetMachinesList: (value: IMachines[]) => void,
    SetMachineRefs: (value: IRefs[]) => void
}

export interface IMachinesState {
    DialogState: boolean,
    FullscreenDialogState: boolean,
    Machines: IMachines[],
    MachineDetails: IMachineDetalhes,
    Refs: IRefs[]
}

export interface IComponentWithRedux extends IMachinesActions {
    State: IMachinesState,
}
