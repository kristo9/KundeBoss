import React, { createContext, Dispatch, SetStateAction, useContext, useReducer, useState } from 'react';


type Props = {
    children: React.ReactNode;
  };

type Context = {
    isAuthenticated: boolean;
    user: any;
    token: any;
    setContext: Dispatch<SetStateAction<Context>>;
};

const initialState: Context = {
    isAuthenticated: false,
    user: null,
    token: null,
    setContext: (): void => {}
};


export const AuthContext = createContext(initialState);

type TypeOfAuthContext = typeof AuthContext;

export const AuthenticationReducer = (state: TypeOfAuthContext, action: any) => {
    switch (action.type) {
      case 'LOGIN_AUTHENTICATION':
          console.log("ER VED LOGIN")
          console.log()
        return {
          ...state, 
          isAuthenticated: true,
        };
      case 'LOGOUT':
        console.log("ER VED LOGOUT")
        localStorage.clear();
        return {
          ...state,
          isAuthenticated: false,
          user: null
        };
      default:
        console.log("KJØRER DEFAULT")
        return state;
    }
};

export const LogOut = () => {
    const [state, dispatch] = useReducer(AuthenticationReducer, AuthContext);
    dispatch('LOGOUT');
}

export const LogIn = () => {
    const [state, dispatch] = useReducer(AuthenticationReducer, AuthContext);
    dispatch('LOGIN_AUTHENTICATION');
}

export const Toggle = () => {
    const { isAuthenticated } = useContext(AuthContext);
    (isAuthenticated) ?  LogIn() : LogOut()
}

export const AuthContextProvider = ({children}: Props) : JSX.Element => {
    const [contextState, setContext] = useState<Context>(initialState);

    return (
        <div>
           <AuthContext.Provider value={{ ...contextState, setContext }}>
            {children}
           </AuthContext.Provider>
        </div>
    )
}


/*
          user: action.payload.user,
          token: action.payload.token
*/