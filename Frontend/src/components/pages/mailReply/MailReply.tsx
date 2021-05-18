// Libraries.
import { useContext, useEffect, useState } from 'react';

// Function Calls.
import { getReply, sendReply } from '../../../azure/api';

// Context
import { LanguageContext } from '../../../Context/language/LangContext';

// CSS
import './MailReply.css';

/*
Page for mail replies. When someone answers a mail they get sent to this components page. 
*/

const getReplyText = (replyId) => getReply(window.location.search.split('=')[1]).then(() => getReply(replyId));

export const MailReply = () => {

  const { dictionary } = useContext(LanguageContext)

  const [mail, setMail] = useState('');             // Sets local state mail to empty.
  const [reply, setReply] = useState(dictionary.Fetching);  // Sets local state reply to "Henter".
  const [btnBool, setBtnBool] = useState(Boolean);  // Sets local state btnBool to 'Boleean'.
  const [firstLoad, setFistLoad] = useState(true);  // Sets local state first load to true.abs
  const [status, setStatus] = useState('');         // Sets local state status to empty.
  const [replyCode, setReplyCode] = useState('');   // Sets local state replyCode to empty. 

  // UseEffect to 
  useEffect(() => {
    setFistLoad(false);                                                    // Sets first Load to false.
    let getReply = async () => {                                           // GetsReply. 
      let res = await getReplyText(window.location.search.split('=')[1]);  // Gets
      if (!res?.text?.reply) {
        setReply('');
      } else if (!res?.text?.reply.text) {
        setReply(dictionary.mailSetRecived);
      } else {
        setReply(res?.text?.reply.text);
      }

      setReplyCode(res?.text?.replyCode);
    };
    if (firstLoad) {
      getReply();
    }
  });

  return (
    <div className='MailReply'>
      <div className='page'>
        <h1>{dictionary.registerAnswer}</h1>
      </div>
      <p style={{ whiteSpace: 'pre-wrap' }}>
        {(reply && reply != dictionary.Fetching && reply != dictionary.MailRecived ? dictionary.EarlierAnswer + ':\n\n' : '') +
          reply}
      </p>
      <div>
        <textarea
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          placeholder={dictionary.writeHere}
          style={{ width: '370px' }}
          rows={8}
          cols={5}
        />
      </div>
      <button
        disabled={btnBool}
        id='replyButton'
        onClick={async () => {
          let res = sendReply(window.location.search.split('=')[1], mail?.length > 0 ? mail : null, replyCode);
          setBtnBool(true);
          setStatus((await res).status === 200 ? dictionary.answerRecived : dictionary.somethingWrong);
        }}
      >
        {dictionary.sendAnswer}
      </button>
      <p>{status}</p>
    </div>
  );
}

export default MailReply;
