import { Context, HttpRequest } from '@azure/functions';
import { prepInput } from '../SharedFiles/dataValidation';
import { collections, connectRead } from '../SharedFiles/dataBase';
import { Db } from '../SharedFiles/interfaces';
import { errorQuery } from '../SharedFiles/auth';

export default (context: Context, req: HttpRequest) => {
  let replyId;
  req.body = prepInput(context, req.body);

  const functionQuery = (db: Db) => {
    db.collection(collections.mail).findOne({ 'receivers.replyId': replyId }, {}, (error: any, docs: any) => {
      if (error) {
        errorQuery(context);
        context.res.body = 'Something went wrong';
        return context.done();
      }
      if (!docs) {
        context.log('No document found');

        context.res = {
          headers: {
            'Content-Type': 'text/html',
          },
          status: 400,
          body: '<h1>Feil replyId</h1>',
        };
        return context.done();
      }
      let receiver = docs.receivers.find((receiver) => receiver.replyId === replyId);
      if (receiver.reply === null) {
        context.res = {
          headers: {
            'Content-Type': 'text/html',
          },
          body:
            '<body>    <script defer>      function sendReply() {        const fakeFetch = new Promise((resolve) => {          setTimeout(() => {            resolve({ text: "Random text", status: 200 });          }, 500);        });        document.getElementById("replyButton").disabled = true;        var data = document.getElementById("responseText").value;        var loading = true;        var loadingBar = "";        var options = {          method: "POST",          body: {},        };        var options = {          method: "POST",          body: JSON.stringify({ replyText: data, replyId: ' +
            '"' +
            replyId +
            '"' +
            '        }),        };        fetch(' +
            '"' +
            process.env['ReceiveMailUrl'] +
            '"' +
            ', options)        .then(async (response) => {            loading = false;        console.log(response);var data = document.getElementById("responseText").value;if (response.status === 400) { document.getElementById("replyButton").disabled = false;} var text = (await response.json()).text;return { text, response };}).then((response) => {console.log(response);document.getElementById("demo").innerHTML = response.text;})      .catch(() => {            loading = false;            document.getElementById("demo").innerHTML = "Connection failed";          });        async function loadingb() {          while (loading) {            loadingBar += "=";            document.getElementById("demo").innerHTML = loadingBar;            await new Promise((r) => setTimeout(r, 100));            if (loadingBar.length > 4) {              loadingBar = "";            }          }        }        loadingb();      }    </script>    <h1>Svar</h1>    <textarea id="responseText" name="responseText" rows="8" cols="50" style="resize: none"></textarea> <br /><br />    <button id="replyButton" onclick="sendReply()">Send svar</button>    <p id="demo"></p>  </body>',
        };
        context.done();
      } else {
        context.res = {
          headers: {
            'Content-Type': 'text/html',
          },
          body: '<h1>Svar er allerede registrert</h1>',
        };
        return context.done();
      }
    });
  };

  if (req.query.replyId) {
    replyId = req.query.replyId;
    connectRead(context, functionQuery);
  } else {
    context.res = {
      headers: {
        'Content-Type': 'text/html',
      },
      status: 400,
      body: '<h1>Ingen replyId gitt</h1>',
    };

    return context.done();
  }
};
