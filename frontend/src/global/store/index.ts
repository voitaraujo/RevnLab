import { createStore } from 'redux';
import { Reducers } from '../reducer/index';

export const Store = createStore(Reducers);