// Libraries
import { useContext } from "react";

// Context
import { LanguageContext } from "../../Context/language/LangContext";

/*
When a user dont have access they will see this page.
 */


// Simple function that returnes a message saying user dont have access.
const InitialPage = () => {
  const { dictionary } = useContext(LanguageContext)
  return (
    <div className='add-margins'>
      <p>{dictionary.noAccess}</p>
      <p>{dictionary.contactAdmin}</p>
    </div>
  );
}

export default InitialPage; // Export InitialPage as default functional component.
