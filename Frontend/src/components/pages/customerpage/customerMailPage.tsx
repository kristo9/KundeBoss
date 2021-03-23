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
    <div onClick={() => setOpen(!open)}>
      <b>{mail.subject ? mail.subject : 'Mangler emne'}</b>
      <p> {mail.date}</p>
      <p style={{ whiteSpace: 'pre-wrap' }}>{mail.text}</p>
      {open ? (
        mail.receivers.map((receiver) => {
          return <DisplayMailAnswer receiver={receiver} key={receiver.id} />;
        })
      ) : (
        <p />
      )}
    </div>
  );
}

function DisplayMailAnswer({ receiver }: any) {
  if (receiver.reply && receiver.reply.text) {
    return (
      <div style={{ backgroundColor: 'red' }}>
        <p>From: {receiver.name}</p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{receiver.reply.text}</p>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default CustomerMailPage;
