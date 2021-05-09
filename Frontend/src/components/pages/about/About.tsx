import { LanguageContext } from '../../../Context/language/LangContext';
import { useContext } from 'react';
import './About.css';

/**
 * @returns A react component with the about page
 */
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

export default About;
