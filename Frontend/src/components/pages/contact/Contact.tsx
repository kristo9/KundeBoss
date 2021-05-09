import { LanguageContext } from '../../../Context/language/LangContext';
import { useContext } from 'react';
import './Contact.css';

/**
 * @returns A react component with the contact page
 */
function Contact() {
  const { dictionary } = useContext(LanguageContext);

  return (
    <div className='Contact add-margins'>
      <div className='page'>
        <h1 className = 'title'>{dictionary.contact}</h1>
        <h1>{dictionary.contactPage.contactAdmin}</h1>
        <h1>{dictionary.contactPage.location}</h1>
        <h1>{dictionary.contactPage.openingHours}</h1>
      </div>
    </div>
  );
}

export default Contact;
