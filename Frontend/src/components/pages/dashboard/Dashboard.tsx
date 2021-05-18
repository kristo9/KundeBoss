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
import { stringify } from 'querystring';
import SendMail from '../customerpage/subPages/customerSendMail';
import { propTypes } from 'react-bootstrap/esm/Image';

/**
 * A class that contains and renders the dashboard
 */

const Dashboard = () => {
  const { dictionary } = useContext(LanguageContext);

  const [customers, setCustomers] = useState(null);
  const [name, setName] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(null);
  const [mailOpen, setMailOpen] = useState(false);

  const [selectedCutomers, setSelectedCustomers] = useState(null);

  useEffect(() => {
    const fetchName = async () => {
      let customers = await getEmployee();
      setCustomers(customers);
      setFilter(customers?.customerInformation);
      setName(customers?.name);
      setSelectedCustomers(new Array(customers?.customerInformation?.length).fill(false));

      console.log(customers?.customerInformation);
    };

    fetchName();
  }, []);

  function updateSelectedCutomer(index: number) {
    console.log(index);
    setSelectedCustomers(
      selectedCutomers?.map((customer, i) => {
        return index === i ? !customer : customer;
      })
    );
  }

  useEffect(() => {
    const filtered = (e) => {
      const filtered = customers.customerInformation.filter((customer) => {
        const tag = customer.tags.toString().toLowerCase();
        const name = customer.name.toString().toLowerCase();
        const currsearch = tag + name;
        return currsearch.indexOf(search.toLowerCase()) !== -1;
      });
      setFilter(filtered);
    };
    if (name !== null) {
      filtered(search);
    }
  }, [search]);

  return (
    <div className='add-margins'>
      {!mailOpen ? (
        <div>
          <DisplayGreeting name={name} dictionary={dictionary} />
          <div style={{ float: 'right' }}>
            <button className='editButton' style={{ marginRight: '1em' }} onClick={() => setMailOpen(true)}>
              Send Mail
            </button>
            <input
              type='search'
              className='search'
              placeholder={dictionary.search_Name_Tag}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <DisplayCustomers
            updateFunction={updateSelectedCutomer}
            filter={filter}
            name={name}
            dictionary={dictionary}
            selectedCutomersArray={selectedCutomers}
          />
        </div>
      ) : (
        <div>
          <button
            className='editButton'
            style={{ float: 'right', marginTop: '3em' }}
            onClick={() => setMailOpen(false)}
          >
            Tilbake
          </button>
          <SendMail
            customerID={customers.customerInformation.map((customer, index) => {
              if (customer && selectedCutomers[index]) {
                console.log(customer._id + ' ' + index);
                return customer._id;
              }
            })}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Displays a greeting if the user is logged in.
 */
function DisplayGreeting(props: { name; dictionary }) {
  if (props.name !== null) {
    return (
      <h1>
        {props.dictionary.welcome}
        {props.name.split(' ')[0]}
      </h1>
    );
  } else {
    return <h1>{props.dictionary.welcome}</h1>;
  }
}

function DisplayCustomers(props: { filter; name; dictionary; selectedCutomersArray; updateFunction }) {
  const tag = props.dictionary.noTag;
  if (props.name !== null) {
    return (
      <table className='diasplayTable'>
        <thead>
          <tr className='tableHeader'>
            <td style={{ width: '10px' }}></td>
            <td>
              <b>Navn</b>
            </td>
            <td className="contactPerson">
              <b>Kontaktperson</b>
            </td>
            <td className="cm">
              <b>Epost</b>
            </td>
            <td>
              <b>Tags</b>
            </td>
            <td>
              <b>Notifikasjoner</b>
            </td>
          </tr>
        </thead>
        <tbody>
          {
            //Creates a table entry for each customer returned from the database.
            props.filter.map((customer, index) => (
              <InfoBox
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
  } else {
    return <LoadingSymbol />;
  }
}

const InfoBox = (prop) => {
  const tags = prop.tags;
  let history = useHistory();
  let className = 'selectedCustomer';
  if (prop.customerSelected) {
    className = 'selectedCustomerSelected';
  }

  return (
    <tr tabIndex={0} className='rad'>
      <td>
        <div
          onClick={() => prop.updateFunction(prop.index)}
          style={{ height: '1em', width: '1em' }}
          className={className}
        ></div>
      </td>
      <td>
        <b
          onClick={() => {
            history.push('/customerpage/' + prop.id);
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

export default Dashboard;
