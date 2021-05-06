import { createContext, useState, useContext } from 'react';
import { languageOptions, dictionaryList } from './LangDir';

// create the language context with default selected language
interface ITodosContextData {
  userLanguage: any;
  dictionary: any;
  userLanguageChange: (c: string) => void;
}

export const LanguageContext = createContext<ITodosContextData>({
  userLanguage: 'en',
  dictionary: dictionaryList.en,
  userLanguageChange: () => {},
});

// it provides the language context to app
export function LanguageProvider({ children }) {
  const defaultLanguage = window.localStorage.getItem('rcml-lang');
  const [userLanguage, setUserLanguage] = useState(defaultLanguage || 'en');

  const provider = {
    userLanguage,
    dictionary: dictionaryList[userLanguage],
    userLanguageChange: (selected) => {
      const newLanguage = languageOptions[selected] ? selected : 'en';
      setUserLanguage(newLanguage);
      window.localStorage.setItem('rcml-lang', newLanguage);
    },
  };

  return <LanguageContext.Provider value={provider}>{children}</LanguageContext.Provider>;
}

export default function LanguageSelector() {
  const { userLanguage, userLanguageChange } = useContext(LanguageContext);

  // set selected language by calling context method
  const handleLanguageChange = (e) => userLanguageChange(e.target.value);

  return (
    <select onChange={handleLanguageChange} value={userLanguage}>
      {Object.entries(languageOptions).map(([id, name]) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </select>
  );
}

export function Text({ tid }) {
  const languageContext = useContext(LanguageContext);

  return languageContext.dictionary[tid] || tid;
}
