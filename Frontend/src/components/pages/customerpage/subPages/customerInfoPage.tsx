// Libraries
import { useContext } from 'react';

// Components
import { DisplayTextAndInfo, ContactPersonInfo } from '../../../basicComp/display';

// Context
import { LanguageContext } from '../../../../Context/language/LangContext';

//CSS
import '../../../basicComp/basic.css';

/**
 * Displayes the customer information.
 * @param {any} customerInfo contains all the information about the customer being displayed.
 * @returns a react-component with the customer information.
 */

// Main function organizing customer information page. 
export const CustomerInfoPage = ({ customerInfo }: any) => {
  const { dictionary } = useContext(LanguageContext)
  return (
    <div>
      <h1 className='color-dark heading'>{dictionary.information}</h1>
      <div className='displayInfoDiv'>
        <DisplayTextAndInfo text={dictionary.name} information={customerInfo.name} altText={dictionary.missingName} />
      </div>
      <ContactPersonInfo
        name={customerInfo.contact.name}
        mail={customerInfo.contact.mail}
        phone={customerInfo.contact.phone}
      />
      <DisplayTags tags={customerInfo.tags} />

      <div className='displayInfoDiv'>
        <DisplayTextAndInfo text={dictionary.note} information={customerInfo.comment} altText={dictionary.custNoNote} />
      </div>

      <div className='displayInfoDiv'>
        <DisplayTextAndInfo
          text={dictionary.references}
          information={customerInfo.infoReference}
          altText={dictionary.custNoReferences}
        />
      </div>
    </div>
  );
}

/**
 * Displayes the tags provided.
 * @param {any} tags array of tags.
 * @returns a react component with the tags.
 */
function DisplayTags(props: { tags: any }) {
  const { dictionary } = useContext(LanguageContext)
  return (
    <div className='displayInfoDiv'>
      <h3>{dictionary.tags}</h3>
      {props?.tags ? (
        <ul className='listStyle addMarginLeft'>
          {props.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : (
      <p>{dictionary.custNoTags}</p>
      )}
    </div>
  );
}
