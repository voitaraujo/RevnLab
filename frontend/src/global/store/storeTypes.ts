import { IMachinesState } from '../reducer/MachinesReducer/MachineReducerTypes'
import { IStoragesState } from '../reducer/StoragesReducer/StoragesReducerTypes'

export interface IStore {
    MachinesState: IMachinesState,
    StoragesState: IStoragesState
}