// Libraries
import { useContext, useEffect, useState } from 'react';

// Function Call
import { registerMailVisit } from '../../../../azure/api';

// Context
import { LanguageContext } from '../../../../Context/language/LangContext';

// CSS
import '../../../basicComp/basic.css';
import '../mail.css';

/**
 * @returns a react component with the mail page.
 */
function CustomerMailPage({ customerInfo }: any) {
  const { dictionary } = useContext(LanguageContext); // Import global language context

  const [mails] = useState(customerInfo.mails); // Local mails state set to existing mails.
  const [filterMails, setFilterMail] = useState(customerInfo.mails); // Local filtersMails state set to existing mails.
  const [search, setSearch] = useState(''); // Local search state.

  // UseEffect to sorting searching for mail.
  useEffect(() => {
    const filtered = (e) => {
      // Filtered function to filter mail corresponding to search.
      const filtered =
        mails &&
        mails.filter((mail) => {
          // Filter mails.
          const subject = mail.subject.toString().toLowerCase(); // Set text to lower case.
          const text = mail.text.toString().toLowerCase(); // Set subject to lowercase,
          const currsearch = subject + text; // Add text and subject to string.
          return currsearch.indexOf(search.toLowerCase()) !== -1; // Return if search match any of currsearch string.
        });
      setFilterMail(filtered); // Set filtered mails to const filtered.
    };
    filtered(search); // Execute filtered function.
  }, [search]); // Run everytime search updates.

  return (
    <div>
      <h1 className='color-dark heading'> {dictionary.mail} </h1>
      <div style={{ marginBottom: '0.5em', float: 'right' }}>
        <input
          className='search'
          placeholder={dictionary.search_Subject_Text}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>

      <div>
        {filterMails.map((mail) => {
          return <DisplayMail mail={mail} key={mail._id} />;
        })}
      </div>
    </div>
  );
}

function DisplayMail({ mail }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className='displayInfoDiv' style={{ clear: 'right' }}>
      <div className='smallText'> {formatDate(mail.date)}</div>
      <div
        onClick={() => {
          setOpen(!open);
          if (mail.newContent === true) {
            registerMailVisit(mail._id, window.location.pathname.split('/')[2]);
            mail.newContent = false;
          }
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <b style={{ flex: 1 }}>{mail.subject ? mail.subject : 'Mangler emne'}</b>
          <ReceiversStatus receivers={mail.receivers} />
          {mail.newContent === true ? <div className='alert'></div> : null}
        </div>
      </div>

      {open ? <OpenDisplayMail mail={mail} /> : null}
    </div>
  );
}

function OpenDisplayMail({ mail }: any) {
  return (
    <div>
      <p>{mail.text}</p>
      <hr className='mailHr'></hr>

      <div>
        {mail.receivers.map((receiver) => {
          return <DisplayMailAnswer receiver={receiver} key={receiver.id} />;
        })}
      </div>
    </div>
  );
}

function DisplayMailAnswer({ receiver }: any) {
  if (receiver) {
    return (
      <div className='table-row'>
        <p className='table-cell name'>{receiver.name ? receiver.name : 'Mangler navn'}</p>
        <p className='table-cell'>
          {receiver.reply === null ? 'Har ikke svart' : receiver.reply.text ? receiver.reply.text : 'Har bekreftet.'}
        </p>
      </div>
    );
  }
}

// Converts YYYY-MM-DDThh:mm:ss.xxx
// Too      DD.MM.YYYY, hh:mm:ss
function formatDate(date: string) {
  let newDate =
    date.substring(8, 10) + '.' + date.substring(5, 7) + '.' + date.substring(0, 4) + ', ' + date.substring(11, 19);
  return newDate;
}

function ReceiversStatus(props: { receivers: any }) {
  let sendt = props.receivers.length;
  let replys = props.receivers.filter((reciver) => {
    return typeof reciver?.reply?.text === 'string';
  }).length;
  let accept = props.receivers.filter((reciver) => {
    return typeof reciver?.reply?.text === 'boolean';
  }).length;
  // return <p style={{ margin: 0, float: 'right' }}>{props.receivers.length} mottakere</p>;
  return <p>{sendt + 's ' + replys + 'r ' + accept + 'a'} </p>;
}

export default CustomerMailPage;
