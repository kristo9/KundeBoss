// Libraries
import { useEffect, useState, useContext } from 'react';
import LoadingSymbol from '../../basicComp/loading';

// Component and function imports
import { getEmployee } from '../../../azure/api';
import { useHistory } from 'react-router-dom';

// CSS imports
import './Dashboard.css';
import '../../basicComp/basic.css';
import { LanguageContext } from '../../../Context/language/LangContext';
import SendMail from '../customerpage/subPages/customerSendMail';

/**
 * A functional component that returns the dashboard for the user.
 */

// Main component. Creates the dashboard and returns this as a component.
const Dashboard = () => {
  const { dictionary } = useContext(LanguageContext);              // Dictionary context for translation between languages.

  const [customers, setCustomers] = useState(null);                // Local customers object whitin a local state. Set to null.
  const [name, setName] = useState(null);                          // Local state 'Name' set to null.
  const [search, setSearch] = useState('');                        // Local state 'Search' string set to empty.
  const [filter, setFilter] = useState(null);                      // Local state search filter set to null. 
  const [mailOpen, setMailOpen] = useState(false);                 // Local state 'mailOpen' set to null.
  const [selectedCutomers, setSelectedCustomers] = useState(null); // Local state 'selectedCustomers' set to null.

  //UseEffect function that runs every first render. 
  useEffect(() => {
    const fetchName = async () => {                       // FetchName function. Gets customers name. 
      let customers = await getEmployee();                // Customers is available from return of getEmployee function.
      setCustomers(customers);                            // Set fetched result as customer in local state varable 'Customers'.
      setFilter(customers?.customerInformation);          // Set filter to all customers.
      setName(customers?.name);                           // Set name of the employee the customers belon to.
      setSelectedCustomers(new Array(customers?.customerInformation?.length).fill(false));  // Sets selected customers in array.
    };
    fetchName();        // Runs FetchName function over.
  }, []);               // Runs once every first render.

  //Updates selected cutomer with index.
  const updateSelectedCutomer = (index: number) => {     
    console.log(index);
    setSelectedCustomers(
      selectedCutomers?.map((customer, i) => {
        return index === i ? !customer : customer;
      })
    );
  }

  // UseEffect. Search functionality. 
  useEffect(() => {
    const filtered = (e) => {                                                  // Function that filters customers.
      const filtered = customers.customerInformation.filter((customer) => {    // Maps customers in filtered.
        const tag = customer.tags.toString().toLowerCase();                    // Gets all tags at lowercase.
        const name = customer.name.toString().toLowerCase();                   // Gets name at lower case.
        const currsearch = tag + name;                                         // Checks if currsearch is in tag+name string.
        return currsearch.indexOf(search.toLowerCase()) !== -1;                // If match, returns customer.
      });
      setFilter(filtered);    // Sets filter to filtered result.
    };
    if (name !== null) {
      filtered(search);       // If the user actually has customers, run filtered function with 'search' parameter.
    }
  }, [search]);               // Runs everytime 'search' variable is updated.

  return (
    <div className='add-margins'>
      {!mailOpen ? (          // If mail is not open, show listed customers.  
        <div>
          <DisplayGreeting name={name} dictionary={dictionary} />   {/*Greets the user*/}
          <div style={{ float: 'right' }}>
            <button className='editButton' style={{ marginRight: '1em' }} onClick={() => setMailOpen(true)}>
              {dictionary.sendMail}                                 {/*Send mail button*/}
            </button>
            <input                                                  // Search in displayed users.
              type='search'
              className='search'
              placeholder={dictionary.search_Name_Tag}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <DisplayCustomers                                         // Every user gets presented through DisplayCustomers.
            updateFunction={updateSelectedCutomer}
            filter={filter}
            name={name}
            dictionary={dictionary}
            selectedCutomersArray={selectedCutomers}
          />
        </div>
      ) : (                                                        //Else, if MailIsOpen display mail functionality.
        <div>
          <button                                                  //Go back to customers button.
            className='editButton'
            style={{ float: 'right', marginTop: '3em' }}
            onClick={() => setMailOpen(false)}                     //SetMailOpen is set to false.
          >
            {dictionary.back}
          </button>
          <SendMail                                                // Sends customised mail through imported 'SendMail'.
            customerID={customers.customerInformation.map((customer, index) => {
              if (customer && selectedCutomers[index]) {
                return customer._id;
              }
            })}
          />
        </div>
      )}
    </div>
  );
};


// Displays a greeting if the user is logged in.
const DisplayGreeting = (props: { name; dictionary }) => {     
  if (props.name !== null) {         // Checks if a user is logged in and name has been fetched.
    return (
      <h1>
        {props.dictionary.welcome}
        {props.name.split(' ')[0]}   {/* Gets first name of user. */}
      </h1>
    );
  } else {                          // If no name registred, just print welcome message without name.
    return <h1>{props.dictionary.welcome}</h1>;
  }
}

// Displays customers and their information. 
const DisplayCustomers = (props: { filter; name; dictionary; selectedCutomersArray; updateFunction }) => {
  const { dictionary } = useContext(LanguageContext)
  const tag = props.dictionary.noTag;
  if (props.name !== null) {
    return (
      <table className='diasplayTable'>
        <thead>
          <tr className='tableHeader'>                  {/* Header of the customer rowns. */}
            <td style={{ width: '10px' }}></td>
            <td>
              <b>{dictionary.name}</b>
            </td>
            <td className="contactPerson">              {/* Display contact person. */}
              <b>{dictionary.contactPerson}</b>
            </td>
            <td className="cm">                         {/* Display mail. */}
              <b>{dictionary.mail}</b>
            </td>
            <td>
              <b>{dictionary.tags}</b>                  {/* Display tags. */}
            </td>
            <td>
              <b>{dictionary.notifications}</b>         {/* Display notifications. */}
            </td>
          </tr>
        </thead>
        <tbody>
          {
            //Creates a table entry for each customer returned from the database.
            props.filter.map((customer, index) => (
              <InfoBox                                /* Goes through every customer and uses function component 'InfoBox'*/
                customerName={customer.name}
                contactName={customer.contact.name}
                mail={customer.contact.mail}
                tags={customer.tags}
                key={customer._id}
                id={customer._id}
                notifications={customer.changedMails}
                noTag={tag}
                customerSelected={props.selectedCutomersArray ? props.selectedCutomersArray[index] : false}
                updateFunction={props.updateFunction}
                index={index}
              />
            ))
          }
        </tbody>
      </table>
    );
  } else {    // If props.name is null, show loadingsymbol from imported LoadingComponent.       
    return <LoadingSymbol />;
  }
}

// Infobox alligns the information sent from 'DisplayCustomers', one and one customers at a time. 
const InfoBox = (prop) => {
  const tags = prop.tags;                       
  let history = useHistory();
  let className = 'selectedCustomer';
  if (prop.customerSelected) {
    className = 'selectedCustomerSelected';
  }
  return (
    <tr tabIndex={0} className='rad'>                       {/*Returns a table of customers*/}
      <td>
        <div
          onClick={() => prop.updateFunction(prop.index)}   //Onclick, the clicked customer gets selected. 
          style={{ height: '1em', width: '1em' }}
          className={className}
        ></div>
      </td>
      <td>
        <b
          onClick={() => {
            history.push('/customerpage/' + prop.id);       //Onclick, the user gets sent to the customerpage. 
          }}
        >
          {prop.customerName}
        </b>
      </td>
      <td className="contactPerson">{prop.contactName}</td>
      <td className="cm">{prop.mail}</td>
      <td> {tags.length === 0 ? prop.noTag : prop.tags.toString().split(',').join(', ')} </td>
      <td>{prop.notifications}</td>
    </tr>
  );
};

export default Dashboard;   // Exports default Dashboard function as functional component.
