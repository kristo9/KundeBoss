import React, { useEffect, useState } from 'react';
import { getReply, sendReply } from '../../../azure/api';
import './MailReply.css';

/**
 * @returns A react component with the help page
 */

const getReplyText = (replyId) => getReply(window.location.search.split('=')[1]).then(() => getReply(replyId));

export function MailReply() {
  const [mail, setMail] = useState('');
  const [reply, setReply] = useState('Henter...');
  const [btnBool, setBtnBool] = useState(Boolean);
  const [firstLoad, setFistLoad] = useState(true);
  const [status, setStatus] = useState('');
  const [replyCode, setReplyCode] = useState('');

  useEffect(() => {
    setFistLoad(false);
    let getReply = async () => {
      let reply = await getReplyText(window.location.search.split('=')[1])
      setReply(reply?.text?.replyText);
      setReplyCode(reply?.text?.replyCode);
    };
    if (firstLoad) {
      getReply();
    }
  });

  return (
    <div className='MailReply'>
      <div className='page'>
        <h1>Registrer svar</h1>
      </div>
      <p style={{ whiteSpace: 'pre-wrap' }}>{(reply && reply != 'Henter...' ? 'Tidligere svar:\n\n' : '') + reply}</p>
      <div>
        <textarea
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          placeholder='Skriv her'
          style={{ width: '370px' }}
          rows={8}
          cols={5}
        />
      </div>
      <button
        disabled={btnBool}
        id='replyButton'
        onClick={async () => {
          let res = sendReply(window.location.search.split('=')[1], mail?.length > 0 ? mail : 'Sett',replyCode);
          setBtnBool(true);
          setStatus((await res).status === 200? 'Svar mottatt' : 'Noe gikk galt');
        }}
      >
        Send svar
      </button>
      <p>{status}</p>
    </div>
  );
}

export default MailReply;