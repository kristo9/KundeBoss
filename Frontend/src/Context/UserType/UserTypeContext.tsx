// Library
import { createContext, useState } from 'react';

// Sets interfase for userType context.
interface ITodosContextData {  
    userType: any,
    userTypeChange: any,
  }
  
// Creates context. 
  export const TypeContext = createContext<ITodosContextData>({
    userType: "Not_Defined",
    userTypeChange: () => {},
  });

// UserType provider to provide global context.
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