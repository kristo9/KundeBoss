import { combineReducers } from 'redux'
import islogged from './isLogged'

const allReducers = combineReducers({
    islogged : islogged
});

export default allReducers;