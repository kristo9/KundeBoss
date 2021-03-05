import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import islogged from './isLogged'

const InitialStates = {
    islogged:{name: null}
}

const allReducers = combineReducers({
    islogged
});

const store = createStore(allReducers, InitialStates, applyMiddleware(thunk))


export default store;