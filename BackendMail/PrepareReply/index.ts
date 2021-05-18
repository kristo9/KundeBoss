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

      let reply = receiver?.reply ;

      context.res = {
        body: {
          reply,
          replyCode: process.env['ReplyCode'],
        },
      };
      context.done();
    });
  };

  if (req.body.replyId) {

    replyId = req.body.replyId;
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
