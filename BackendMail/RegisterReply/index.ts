import { Context, HttpRequest } from '@azure/functions';
import { prepInput } from '../SharedFiles/dataValidation';
import { collections, connectWrite } from '../SharedFiles/dataBase';
import { Db } from '../SharedFiles/interfaces';
import { errorQuery } from '../SharedFiles/auth';

/**
 * @description Receives mail reply, and registeres it in the database
 * @param contect : Context
 * @param req : HttpRequest
 */
export default (context: Context, req: HttpRequest): any => {
  req.body = prepInput(context, req.body);

  /*  Returns if there are no request body */
  if (req.body === null) {
    return context.done();
  }
  console.log(req.body.replyText);
  let replyId = null;
  let replyText = null;

  /**
   * @description Registeres reply in database
   * @param db : database connection
   */
  const functionQuery = (db: Db) => {
    db.collection(collections.mail).findOne({ 'receivers.replyId': replyId }, {}, (error: any, docs: any) => {
      if (error) {
        errorQuery(context);
        context.res.body = { text: 'Something went wrong' };

        return context.done();
      }
      /* Finds text from earlier replies */
      let reply = docs?.receivers?.find((receiver) => receiver.replyId == replyId)?.reply?.text;
      let newReply;
      /* Creates string that that will be registered as the reply */
      if (!reply && !replyText) {
        newReply = { 'text': null, 'date': new Date() };
      } else {
        newReply = { 'text': (reply ? reply : '') + replyText + '\n\n', 'date': new Date() };
      }
      /* Inserts reply into the database */
      db.collection(collections.mail).updateOne(
        { 'receivers.replyId': replyId },
        {
          '$set': {
            'receivers.$.reply': newReply,
            'seenBy': [],
          },
        },
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
            context.res = {
              status: 400,
              body: {
                text: 'Error, not found',
              },
            };
          }
          context.done();
        }
      );
    });
  };

  /* Makes sure that a replyId was received */
  if (req.body?.replyId) {
    replyId = req.body.replyId;
    /* Makes sure that a replyText was received and that it's not to long */
    if (req.body?.replyText) {
      if (req.body.replyText.length < 1000) {
        replyText = req.body.replyText == 'null' ? null : req.body.replyText;
      } else {
        context.res = {
          status: 400,
          body: {
            text: 'Feil, hold svartekst under 1000 tegn',
          },
        };
        return context.done();
      }
    }
    connectWrite(context, functionQuery);
  } else {
    context.res.body = 'No replyId found';
    return context.done();
  }
};
