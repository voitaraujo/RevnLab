import { IMachineDetalhes, IMachineRefs, IMachines, IProdutoInventário } from '../../../pages/machines/machinesTypes'

export interface IMachinesActions {
    SetMachineDetails: (value: IMachineDetalhes) => void,
    SetDialogState: (value: boolean) => void,
    SetMachinesList: (value: IMachines[]) => void,
    SetMachineRefs: (value: IMachineRefs[]) => void
}

export interface IMachinesState {
    DialogState: boolean,
    FullscreenDialogState: boolean,
    Machines: IMachines[],
    MachineDetails: IMachineDetalhes,
    Refs: IMachineRefs[],
    Produtos: IProdutoInventário[]
}

export interface IComponentWithRedux extends IMachinesActions {
    State: IMachinesState,
}
