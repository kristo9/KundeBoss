import { isLogedIn } from '../../azure/api';

const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

const isLogged = (state = null, action) => {
  switch (action.type) {
    case 'AUTH':
      /*state = isLogedIn();
            console.log("Dette er islogedin func:")
            console.log(state);
            let currState = null;
            if (state !== null) { currState = 'AUTH' };
            console.log(currState);
            return currState;*/
      return state == null ? 'AUTH' : null;
    default:
      return state;
  }
};
export default isLogged;
