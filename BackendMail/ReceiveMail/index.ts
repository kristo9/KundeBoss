import { Context, HttpRequest } from '@azure/functions';
import { prepInput } from '../SharedFiles/dataValidation';
import { collections, connectWrite } from '../SharedFiles/dataBase';
import { Db } from '../SharedFiles/interfaces';
import { errorQuery } from '../SharedFiles/auth';

/**
 * @description Get alle data about a customer
 * @param contect : Context
 * @param req : HttpRequest
 */
export default (context: Context, req: HttpRequest): any => {
  req.body = prepInput(context, req.body);

  /*  Returns if there are no request body */
  if (req.body === null) {
    return context.done();
  }
  context.log(req.body);

  let replyId = null;
  let replyText = null;

  /**
   * @description Registeres reply in database
   * @param db : database connection
   */
  const functionQuery = (db: Db) => {
    db.collection(collections.mail).updateOne(
      { 'receivers.replyId': replyId },
      { '$set': { 'receivers.$.reply': { 'text': replyText, 'date': new Date() } } },
      (error: any, docs: any) => {
        if (error) {
          errorQuery(context);
          context.res.body = { text: 'Something went wrong' };

          return context.done();
        }
        if (docs.modifiedCount === 1) {
          context.log('Success!');
          context.res = {
            body: { text: replyText ? 'Reply text registered' : 'Confirmation registered' },
          };
        } else {
          context.log('No document found');
          context.res.status = 400;
          context.res.body = { text: 'Error, not found' };
        }
        context.done();
      }
    );
  };

  if (req.body.replyId) {
    replyId = req.body.replyId;
    if (req.body.replyText) {
      replyText = req.body.replyText;
    }
    connectWrite(context, functionQuery);
  } else {
    context.res.body = 'No replyId found';
    return context.done();
  }
};
