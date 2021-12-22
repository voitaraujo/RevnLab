import { IDepositos, IDepositoDetalhes, IRefs, IDepositoInventario } from '../../../pages/storages/storageTypes'

export interface IStoragesState {
    DialogState: boolean,
    FullscreenDialogState: boolean,
    Storages: IDepositos[],
    StorageDetails: IDepositoDetalhes,
    Refs: IRefs[],
    Produtos: IDepositoInventario[]
}