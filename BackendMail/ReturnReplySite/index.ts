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
        context.res.status = 400;
        context.res.body = 'Error, replyId not found';
        return context.done();
      }
      let receiver = docs.receivers.find((receiver) => receiver.replyId === replyId);
      console.log(receiver);
      if (receiver.reply === null) {
        context.res = {
          headers: {
            'Content-Type': 'text/html',
          },
          body:
            '<body><h1>Svar</h1><input type="text" id="data" name="data" textarea="200" /><br /><br /><button id="Button" onclick="sendReply()">Send svar</button><p id="demo"></p><script defer>function sendReply() {document.getElementById("Button").disabled = true;var data = document.getElementById("data").value;var loading = true;var loadingBar = "";var options = {method: "POST",body: JSON.stringify({ replyText: data, replyId: ' +
            '"' +
            replyId +
            '"' +
            ' }),};fetch(' +
            '"' +
            process.env['ReceiveMailUrl'] +
            '"' +
            ', options).then(async (response) => {loading = false;console.log(response);var text = (await response.json()).text;console.log(text);return { text, response };}).then((response) => {console.log(response);document.getElementById("demo").innerHTML = response.text;}).catch(() => {loading = false;document.getElementById("demo").innerHTML = "Connection failed";});async function loadingb() {while (loading) {loadingBar += "=";document.getElementById("demo").innerHTML = loadingBar;await new Promise((r) => setTimeout(r, 100));}}loadingb();}</script></body>',
        };
        context.done();
      } else {
        context.res = {
          headers: {
            'Content-Type': 'text/html',
          },
          body: '<h1>Reply already registrated</h1>',
        };
        context.res.body = 'Reply already registrated';
        return context.done();
      }
    });
  };

  if (req.query.replyId) {
    replyId = req.query.replyId;
    connectRead(context, functionQuery);
  } else {
    context.res.status = 400;
    context.res.body = 'No replyId found';
    return context.done();
  }
};
