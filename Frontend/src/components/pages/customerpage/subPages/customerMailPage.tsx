import react, { useEffect, useState } from 'react';

/**
 * @returns a react component with the mail page.
 */
function CustomerMailPage({ customerInfo }: any) {

  const [mails, setMails] = useState(customerInfo.mails);
  const [filterMails, setFilterMail] = useState(customerInfo.mails);
  const [search, setSearch] = useState('');


  useEffect(() => {
    const filtered = (e) => {        
      const filtered = mails && mails.filter((mail) => {
          const subject = mail.subject.toString().toLowerCase();
          const text = mail.text.toString().toLowerCase();
          const currsearch = subject + text;
          return currsearch.indexOf(search.toLowerCase()) !== -1;
        });
      setFilterMail(filtered);
    };
    filtered(search);
  }, [search]);
  

  return (
    <div>
      <h1> Mail </h1>
      <input  
            type="search"
            className="searchbar"
            placeholder="Search subject or text"
            value={search}
            onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      {filterMails.map((mail) => {
        return <DisplayMail mail={mail} key={mail._id} />;
      })}
    </div>
  );
}

function DisplayMail({ mail }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div onClick={() => setOpen(!open)}>
        <b>{mail.subject ? mail.subject : 'Mangler emne'}</b>
        <span> {formatDate(mail.date)}</span>
        <button> {open ? 'Lukk' : 'Åpne'}</button>
        <p>{mail.receivers.length} mottakere</p>
      </div>

      {open ? <OpenDisplayMail mail={mail} /> : ''}
    </div>
  );
}

// function ClosedDisplayMail({ mail }: any) {
//   return <p></p>;
// }

function OpenDisplayMail({ mail }: any) {
  const [repliesOpen, setRepliesOpen] = useState(false);

  return (
    <div>
      <p style={{ whiteSpace: 'pre-wrap' }}>{mail.text}</p>
      <button
        onClick={() => {
          setRepliesOpen(!repliesOpen);
        }}
      >
        {repliesOpen ? 'Skjul svar' : 'Vis svar'}
      </button>
      {repliesOpen ? <OpenRepliesToMail mail={mail} /> : ''}
    </div>
  );
}

function OpenRepliesToMail({ mail }: any) {
  return (
    <div>
      {mail.receivers.map((receiver) => {
        return <DisplayMailAnswer receiver={receiver} key={receiver.id} />;
      })}
    </div>
  );
}

function DisplayMailAnswer({ receiver }: any) {
  if (receiver.reply) {
    return (
      <div style={{ backgroundColor: 'red' }}>
        <p>From: {receiver.name}</p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{receiver.reply.text ? receiver.reply.text : 'Har bekreftet.'}</p>
      </div>
    );
  } else {
    return <div></div>;
  }
}

// YYYY-MM-DDThh:mm:ss.xxxZ
// hh:mm:ss DD.MM.YYYY
function formatDate(date: string) {
  let newDate =
    date.substring(11, 19) + ' ' + date.substring(8, 10) + '.' + date.substring(5, 7) + '.' + date.substring(0, 4);
  return newDate;
}

export default CustomerMailPage;
