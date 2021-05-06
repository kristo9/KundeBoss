import { createContext, useState } from 'react';

interface ITodosContextData {
    userType: any,
    userTypeChange: any,
  }
  
  export const TypeContext = createContext<ITodosContextData>({
    userType: "Not_Defined",
    userTypeChange: () => { },
  });

  export function UserTypeProvider({ children }) {
    const [ userType, userTypeChange ] = useState(TypeContext);

    const provider = {
        userType,
        userTypeChange,
    }
  
    return (
      <TypeContext.Provider value={provider}>
        {children}
      </TypeContext.Provider>
    );
  };