import { Context, HttpRequest } from '@azure/functions';
import { prepInput, errorWrongInput } from '../SharedFiles/dataValidation';
import { collections, connectRead, connectWrite } from '../SharedFiles/dataBase';
import { Db } from '../SharedFiles/interfaces';
import { simpleParser } from 'mailparser';
import { errorQuery } from '../SharedFiles/auth';

module.exports = (context: Context, req: HttpRequest): any => {
  if (req.body === null) {
    return context.done();
  }

  let replyId = null;
  let replyText = null;

  const parseMail = () => {
    try {
      simpleParser(req.body).then((parsed) => {
        parsed = JSON.parse(JSON.stringify(parsed));
        let data = parsed.attachments[0].content.data;
        let decodedData = Buffer.from(data).toString();
        let dataArr = decodedData.split('--xYzZY');
        for (let i = 0, len = dataArr.length; i < len; ++i) {
          if (dataArr[i].includes('name="subject"')) {
            replyId = dataArr[i].substring(dataArr[i].lastIndexOf('<replyId:') + 9, dataArr[i].lastIndexOf('>'));
          } else if (dataArr[i].includes('name="text"')) {
            replyText = dataArr[i].substring(dataArr[i].indexOf('name=') + 14);
            replyText = replyText.substring(0, replyText.indexOf(process.env['EmailAddress'] + ' wrote:'));
            replyText = replyText.substring(0, replyText.lastIndexOf('\n'));
            replyText = replyText.replace(/^\s+|\s+$/g, '');
            replyText = prepInput(context, replyText);
          }
        }
        connectWrite(context, functionQuery);
      });
    } catch {
      errorWrongInput(context, 'error while parsing mail');
      return context.done();
    }
  };

  const functionQuery = (db: Db) => {
    db.collection(collections.mail).updateOne(
      { 'receivers.replyId': replyId },
      { '$set': { 'receivers.$.reply': { 'text': replyText, 'date': new Date() } } },
      (error: any, docs: any) => {
        if (error) {
          errorQuery(context);
          context.res.body = 'Something went wrong';
          return context.done();
        }
        if (docs.modifiedCount === 1) {
          context.log('Success!');
          context.res = {
            body: '<h2>Registered</h2>',
            headers: {
              'Content-Type': 'text/html',
            },
          };
        } else {
          context.log('No document found');
          context.res.body = 'Not found';
        }
        context.done();
      }
    );
  };

  if (req.method === 'GET') {
    if (req.query.replyId) {
      replyId = req.query.replyId;
      connectWrite(context, functionQuery);
    } else {
      context.res.body = 'No replyId found';
      context.done();
    }
  } else {
    parseMail();
  }
};
