import { isLogedIn } from '../../azure/api'

const isLogged = (state = null, action) => {
    switch (action.type) {
        case 'AUTH':
            state = isLogedIn();
            console.log(state);
            let currState = null;
            if (state) { currState = 'AUTH' };
            console.log(currState);
            return currState;

            /*if (state == null) {return 'Auth'}
            else {return null}*/
        default:
            return state;
    }
}
export default isLogged;