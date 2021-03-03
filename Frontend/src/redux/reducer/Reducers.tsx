import { createStore, combineReducers } from 'redux'
import islogged from './isLogged'

const InitialStates = {
    islogged:{name: null}
}

const allReducers = combineReducers({
    islogged
});

const store = createStore(allReducers, InitialStates)


export default store;