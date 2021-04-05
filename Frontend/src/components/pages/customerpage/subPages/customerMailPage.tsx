import react, { useState } from 'react';

/**
 * @returns a react component with the mail page.
 */
function CustomerMailPage({ customerInfo }: any) {
  console.log(customerInfo);
  return (
    <div>
      <h1>Her er det Mail</h1>
      {customerInfo.mails.map((mail) => {
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
