import { combineReducers } from 'redux';

import { MachinesReducer } from './MachinesReducer'

export const Reducers = combineReducers({
  MachinesState: MachinesReducer,
});