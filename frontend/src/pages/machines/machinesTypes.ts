import { IMachinesState } from '../../global/reducer/MachineReducerTypes'

//formato da lista de máquinas
export interface IMachines {
    id?: string;
    CHAPA: string;
    Modelo: string;
    SERIE: string;
}

//props que o details.tsx tem que receber por instancia
interface IDetailsProps {
    DLCod: string,
    Chapa: string
}

//props que o details.tsx vai receber do redux
interface IDetailsPropsFromRedux {
    SetDialogState: (value: boolean) => void
    State: IMachinesState
}

//união de props que o details.tsx deve receber
export type IDetailsPropsWithRedux = IDetailsProps & IDetailsPropsFromRedux

//formato dos detalhes da máquina
export interface IMachineDetalhes {
    N1_ZZFILIA: string;
    CHAPA: string;
    SERIE: string;
    CLICOD: string;
    CLILJ: string;
    DL: string;
    Modelo: string;
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
export interface IRefs {
    DLCod: string;
    Refdt: string;
    InvMovSeq: number;
    InvMovStaus: number;
}

//props que o inventory.tsx deve receber
export interface IInventoryProps {
    Info: IMachineDetalhes;
    DLCod: string;
    Refs: IRefs[];
}

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
    SetDialogState: (value: boolean) => void,
    SetMachinesList: (value: IMachines[]) => void,
    State: IMachinesState
}

//props que o index.tsx deve receber por instancia
// interface IIndexProps {}

// export type IIndexPropsWithRedux = IIndexProps & IIndexPropsFromRedux
export type IIndexPropsWithRedux = IIndexPropsFromRedux