import { LanguageContext } from '../../../Context/language/LangContext';
import { useContext } from 'react';
import './Contact.css';

/*
Contact returns a React Component with contact information if anyone would like to contact the developers og administator
  of the application.
 */

// A simple function that returns a small contact page with some information.
const Contact = () => {
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

export default Contact; // Export 'Contact' function as default.
