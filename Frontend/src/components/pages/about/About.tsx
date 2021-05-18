// Libraries
import { useContext } from 'react';

// Context
import { LanguageContext } from '../../../Context/language/LangContext';

// CSS
import './About.css';

/*
Returns a react component with the About.tsx component. The components sends some base information about the 
  whole web application.
*/

// Simple function returns the aboutpage. 
function About() {
  const { dictionary } = useContext(LanguageContext);
  return (
    <div className='About add-margins'>
      <div className='page'>
        <h1 className ='title'> {dictionary.contact}</h1>
        <h1 className = 'center'>{dictionary.aboutPage.introduction1}</h1>
        <h1 className = 'center'>{dictionary.aboutPage.introduction2}</h1>
      </div>
    </div>
  );
}

export default About; // Export About as a functional component. 
