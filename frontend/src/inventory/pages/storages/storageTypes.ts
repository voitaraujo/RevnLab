import { IStoragesState } from '../../global/reducer/StoragesReducer/StoragesReducerTypes'

//formato dos detalhes do depósito
export interface IDepositoDetalhes {
    Filial: string;
    DLCod: string;
    DLQtEq: number;
    DLNome: string;
    DLEndereco: string;
    DLBairro: string;
    DLCEP: string;
    DLUF: string;
    DLMunicipio: string;
    DLMunicipioCod: string;
    DLStatus: string;
    DLLoja: string;
    pastMonthsDLInv: IPastMonthsDLData[],
    pastMonthsDLEqInv: {
        Ref: string,
        Eqs: IPastMonthsDLEqData[]
    }[]
}

//formato das referencias
export interface IRefs {
    DLCod: string,
    Refdt: string,
    InvMovSeq: number,
    InvMovStaus: number
}

//props que o details.tsx deve receber
// export interface IDetailsProps {
// }

export interface IDetailsPropsFromRedux {
    State: IStoragesState,
    SetStorageDetails: (value: IDepositoDetalhes) => void,
    SetStorageRefs: (value: IRefs[]) => void,
    SetDialogState: (value: boolean) => void,
}

// export type IDetailsPropsWithRedux = IDetailsProps & IDetailsPropsFromRedux
export type IDetailsPropsWithRedux = IDetailsPropsFromRedux

//formato da lista de depósitos
export interface IDepositos {
    id?: string;
    DLCod: string;
    DLNome: string;
    Filial: string;
    Faltam: number
}

//DTO = data transfer object
export interface LoadDTO {
    storages: IDepositos[];
}

export interface IDepositoInventario {
    Refdt: string;
    Filial: string;
    DLCod: string;
    PROD: string;
    PRODUTO: string;
    Qtd: number | string | null;
}

// export interface IInventoryProps {
// }

export interface IInventoryPropsFromRedux {
    State: IStoragesState,
    SetProdutos: (value: IDepositoInventario[]) => void
}

// export type IInventoryPropsWithRedux = IInventoryProps & IInventoryPropsFromRedux
export type IInventoryPropsWithRedux = IInventoryPropsFromRedux

interface IPastMonthsDLData {
    DLCod: string,
    Refdt: string,
    FaltamProdutos: number
}

interface IPastMonthsDLEqData {
    Refdt: string,
    CHAPA: string,
    Faltam: number
}

export interface IListItemProps {
    produto: IDepositoInventario;
    index: number;
    changeHandler: (item: IDepositoInventario, index: number) => void;
}

export interface IIndexPropsFromRedux {
    SetStoragesList: (value: IDepositos[]) => void,
    SetDialogState: (value: boolean) => void,
    SetStorageDetails: (value: IDepositoDetalhes) => void,
    SetStorageRefs: (value: IRefs[]) => void,
    State: IStoragesState
}