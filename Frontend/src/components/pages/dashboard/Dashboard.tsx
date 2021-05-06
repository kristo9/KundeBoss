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


/**
 * A class that contains and renders the dashboard
 */


const Dashboard = () => {

  const { dictionary } = useContext(LanguageContext);

  const [customers, setCustomers] = useState(null);
  const [name, setName] = useState(null);
  const [search, setSearch ] = useState('');
  const [filter, setFilter] = useState(null);
  
  useEffect (() => {
    const fetchName = async () => {
      let customers = await getEmployee();
      setCustomers(customers);
      setFilter(customers.customerInformation);
      setName(customers.name);
    };
    fetchName();
  }, [])

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
    if(name !== null) {filtered(search)};
  }, [search]);

  return (
    <>
    <div className='add-margins'>
        {displayGreeting({name}, {dictionary})}
        <div style={{ float: 'right' }}>
        <input  
            type="search"
            className="search"
            placeholder={dictionary.search_Name_Tag}
            value={search}
            onChange={(e) => { setSearch(e.target.value); } }
          />
        </div>
        <div>{displayCustomers({filter}, {name}, {dictionary})}</div>
      </div>
    </>
  );
}


const displayGreeting = ({name}, {dictionary}) => {
  if (name !== null) {
    return <h1>{dictionary.welcome}{name.split(' ')[0]}</h1>;
  } else {
    return <h1>{dictionary.welcome}</h1>;
  }
}


const displayCustomers = ({filter}, {name}, {dictionary}) => {
  const tag = dictionary.noTag
  if (name !== null) {
    return (
      <table className='diasplayTable'>
        <tbody>
          {
            //Creates a table entry for each customer returned from the database.
            filter.map((customer) => (
              <InfoBox 
                customerName={customer.name}
                contactName={customer.contact.name}
                mail={customer.contact.mail}
                tags={customer.tags}
                key={customer._id}
                id={customer._id}
                noTag={tag}
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
  let history = useHistory();
  const tags = prop.tags;

  return (
    <tr
      tabIndex={0}
      className='rad'
      onClick={() => {
        history.push('/customerpage/' + prop.id);
      }}
    >
      <td>
        <b>{prop.customerName}</b>
      </td>
      <td>{prop.contactName}</td>
      <td>{prop.mail}</td>
      <td> {tags.length === 0 ? prop.noTag : prop.tags.toString().split(',').join(', ')} </td>
    </tr>
  );
}

export default Dashboard;


