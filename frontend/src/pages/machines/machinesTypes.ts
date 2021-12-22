import { IMachinesState } from '../../global/reducer/MachinesReducer/MachineReducerTypes'

//formato da lista de máquinas
export interface IMachines {
    id?: string;
    CHAPA: string;
    Modelo: string;
    SERIE: string;
    Faltam: number;
}

//props que o details.tsx tem que receber por instancia
// interface IDetailsProps {
// }

//props que o details.tsx vai receber do redux
interface IDetailsPropsFromRedux {
    SetDialogState: (value: boolean) => void,
    SetMachineRefs: (value: IMachineRefs[]) => void,
    SetMachineDetails: (value: IMachineDetalhes) => void,
    State: IMachinesState
}

//união de props que o details.tsx deve receber
// export type IDetailsPropsWithRedux = IDetailsProps & IDetailsPropsFromRedux
export type IDetailsPropsWithRedux = IDetailsPropsFromRedux

//formato dos detalhes da máquina
export interface IMachineDetalhes {
    N1_ZZFILIA: string;
    CHAPA: string;
    SERIE: string;
    CLICOD: string;
    CLILJ: string;
    DL: string;
    Modelo: string;
    pastMonthsEqInv: IPastMonthsEqData[]
}

//formato de cada produto que compõe o inventário
export interface IProdutoInventário {
    DLCod: string;
    PROD: string;
    SEL: string;
    PRODUTO: string;
    Qtd: number | string | null;
    Refdt: string;
    Filial: string;
    CHAPA: string;
}

//formato das datas Referencia
export interface IMachineRefs {
    DLCod: string;
    Refdt: string;
    InvMovSeq: number;
    InvMovStaus: number;
}

//props que o inventory.tsx deve receber
// export interface IInventoryProps {
// }

export interface IInventoryPropsFromRedux {
    State: IMachinesState,
    SetProdutos: (value: IProdutoInventário[]) => void,
}
// export type IInventoryPropsWithRedux = IInventoryProps & IInventoryPropsFromRedux
export type IInventoryPropsWithRedux = IInventoryPropsFromRedux
    

//props que o ListItem.tsx deve receber
export interface IListItemProps {
    produto: IProdutoInventário;
    index: number;
    changeHandler: (item: IProdutoInventário, index: number) => void;
}

//parametros que o index.tsx deve receber como query params
export interface IIndexParams {
    DL: string;
}

//DTO = data transfer object
export interface IIndexLoadDTO {
    machines: IMachines[];
}


//props que o index.tsx deve receber do redux
interface IIndexPropsFromRedux {
    State: IMachinesState,
    SetDialogState: (value: boolean) => void,
    SetMachinesList: (value: IMachines[]) => void,
    SetMachineRefs: (value: IMachineRefs[]) => void,
    SetMachineDetails: (value: IMachineDetalhes) => void
}

//props que o index.tsx deve receber por instancia
// interface IIndexProps {}

// export type IIndexPropsWithRedux = IIndexProps & IIndexPropsFromRedux
export type IIndexPropsWithRedux = IIndexPropsFromRedux

interface IPastMonthsEqData {
    Refdt: string,
    CHAPA: string,
    Faltam: number
}