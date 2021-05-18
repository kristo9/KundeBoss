// Libraries
import { createContext, useState, useContext } from 'react';

// Dictionarylist and language options
import { languageOptions, dictionaryList } from './LangDir';

// Pictures
import ukFlag from '../../bilder/uk_Flag.svg.webp';
import norwayFlag from '../../bilder/Flag_of_Norway.png';


// Define interface to langcontext.
interface LanguageInterface {
  userLanguage: any;
  dictionary: any;
  userLanguageChange: (c: string) => void;
}

// Create lang context with default values corresponding to interface.
export const LanguageContext = createContext<LanguageInterface>({
  userLanguage: 'en',
  dictionary: dictionaryList.en,
  userLanguageChange: () => {},
});

// Provide the language context to App.tsx.
export function LanguageProvider({ children }) {
  
  const defaultLanguage = window.localStorage.getItem('rcml-lang');           // Get localstorage language of the user.
  const [userLanguage, setUserLanguage] = useState(defaultLanguage || 'en');  // If default language isnt defined, set it to 'en'.
  
  const provider = {                                    // Sets provider to wrap components. 
    userLanguage,                                       // Current language.
    dictionary: dictionaryList[userLanguage],           // Dictionary from Json files.
    userLanguageChange: (selected) => {                 // When language switch =>
      const newLanguage = languageOptions[selected] ? selected : 'en'; // Set selected, if undefined 'en'.
      setUserLanguage(newLanguage);                                    // Sets userlanguge to 'newLnguage'.
      window.localStorage.setItem('rcml-lang', newLanguage);           // Updates language in localstorage.
    },
  };
  return <LanguageContext.Provider value={provider}>{children}</LanguageContext.Provider>; // Returns provider. 
}

// A button component that can be clicked to change between languages. 
export default function LanguageSelector() {

  const { userLanguage, userLanguageChange } = useContext(LanguageContext); // Import current lang, and update method. 
  const handleLanguageChange = ({ value }) => userLanguageChange(value);    // Set selected language by calling context method.
  
  let value = null;                                                         // Variable to update userLanguagechange
  return (
    <>
      <div className='LangSelect'>
        {userLanguage === 'en' ? (               // If user language is english? Change image to norwegian.
          <img
            src={ukFlag}
            alt='English'
            style={{ height: 20, width: 28 }}
            onClick={() => {
              value = 'no';
              handleLanguageChange({ value });  // When updated picture is clicked, handleLanguagechange updates to norwegian.
            }}
          ></img>
        ) : (                                    // Else user language is norwegian. Change image to english.
          <img
            src={norwayFlag}
            alt='Norsk'
            style={{ height: 20, width: 28 }}
            onClick={() => {
              value = 'en';
              handleLanguageChange({ value });  // When updated picture is clicked, handleLanguagechange updates to english.
            }}
          ></img>
        )}
      </div>
    </>
  );
}