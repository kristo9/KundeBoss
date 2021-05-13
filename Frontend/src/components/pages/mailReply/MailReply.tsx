import React, { Component } from 'react';
import { sendReply } from '../../../azure/api';
import './MailReply.css';

/**
 * @returns A react component with the help page
 */

/* function MailReply() {
  const [state] = useState({btnBool:false,replyText:""})
  return (
    <div className='MailReply'>
      <div className='page'>
        <h1>Velkommen</h1>
        <h1>Svar på mail</h1>
      </div>
      <div>
        <textarea placeholder='Skriv her' style={{ width: '370px' }} rows={8} cols={5} />
      </div>
      <button
        id='replyButton'
        disabled={state.btnBool}
        onClick={() => {
          console.log(state.replyText);
          {state.btnBool = true}
          
        }}
      >
        Send svar
      </button>
    </div>
  );
}

export default MailReply;  */

export default class MailReply extends Component {
  state = {
    btnBool: false,

    email: '',
  };

  handleChangeTxt = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  handleChangeBtn = (e) => {
    this.setState({
      btnBool: e,
    });
  };

  render() {
    return (
      <div className='MailReply'>
        <div className='page'>
          <h1>Velkommen</h1>
          <h1>Svar på mail</h1>
        </div>
        <div>
          <textarea
            value={this.state.email}
            onChange={this.handleChangeTxt}
            placeholder='Skriv her'
            style={{ width: '370px' }}
            rows={8}
            cols={5}
          />
        </div>
        <button
          disabled={this.state.btnBool}
          id='replyButton'
          onClick={async () => {
            let res = sendReply(window.location.search.split('=')[1], this.state.email);

            console.log(this.state.email);
            console.log(window.location.search.split('=')[1]);

            this.handleChangeBtn(true);
            console.log(await res);
          }}
        >
          Send svar
        </button>
      </div>
    );
  }
}
