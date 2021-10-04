export interface IMachinesActions {
    SetMachineDetails: (value: IDetalhes) => void,
    SetDialogState: (value: boolean) => void,
    SetMachinesList: (value: IMachines[]) => void,
    SetMachineRefs: (value: IRefs[]) => void
}

export interface IMachinesState {
    DialogState: boolean,
    FullscreenDialogState: boolean,
    Machines: IMachines[],
    MachineDetails: IDetalhes,
    Refs: IRefs[]
}

export interface IMachines {
    id?: string;
    CHAPA: string;
    Modelo: string;
    SERIE: string;
  }

export interface IComponentWithRedux extends IMachinesActions {
    State: IMachinesState,
}

export interface IStore {
    MachinesState: IMachinesState
}

export interface IDetalhes {
    N1_ZZFILIA: string;
    CHAPA: string;
    SERIE: string;
    CLICOD: string;
    CLILJ: string;
    DL: string;
    Modelo: string;
}

export interface IRefs {
    DLCod: string,
    Refdt: string,
    InvMovSeq: number,
    InvMovStaus: number
}