const isLogged = (state = false, action) => {
    switch (action.type) {
        case 'SIGN_IN':
            return (isLoggedin() ? !state : state);
        case 'SIGN_OUT':
            return (!(isLoggedin()) ? !state : state);
    }
}

export default isLogged;