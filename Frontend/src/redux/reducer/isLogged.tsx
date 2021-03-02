const isLogged = (state = false, action) => {
    switch (action.type) {
        case 'IS_LOGGED_IN':
            console.log("Nå byttes det. !!!!!!!!!!!!!!!!")
            return !state;
        default:
            return state;
    }
}
export default isLogged;