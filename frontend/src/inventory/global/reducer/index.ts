import { combineReducers } from 'redux';

import { MachinesReducer } from './MachinesReducer/MachinesReducer'
import { StoragesReducer } from './StoragesReducer/StoragesReducer'

export const Reducers = combineReducers({
  MachinesState: MachinesReducer,
  StoragesState: StoragesReducer,
});