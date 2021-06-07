import { Context } from '@azure/functions';
import { errorQuery } from '../SharedFiles/auth';
import { collections, connectRead, connectWrite } from '../SharedFiles/dataBase';
import { Db } from '../SharedFiles/interfaces';


/**
 * @description Deletes all mails not registered on a customer or supplier
 */
export default (context: Context, myTimer: any) => {
  let mails = ['replyCounter'];

  /**
   * @description Finds all mail ids registered in all suppliers and customers
   * @param db 
   */
  const findMails = (db: Db) => {
    db.collection(collections.customer)
      .find({})
      .project({ 'mails': 1 })
      .toArray((error: any, docs: any) => {
        if (error) {
          errorQuery(context, 'Failed to query customer collection');
          return context.done();
        } else {
          docs.forEach((customer) => {
            customer?.mails?.forEach((mail) => {
              mails.push(mail);
            });
          });
          db.collection(collections.supplier)
            .find({})
            .project({ 'mails': 1 })
            .toArray((error: any, docs: any) => {
              if (error) {
                errorQuery(context, 'Failed to query supplier collection');
                return context.done();
              } else {
                docs.forEach((supplier) => {
                  supplier?.mails?.forEach((mail) => {
                    mails.push(mail);
                  });
                });

                connectWrite(context, cleanMails);
              }
            });
        }
      });
  };

  /**
   * @description Deletes all mails not registered in any customer or supplier
   * @param db 
   */
  const cleanMails = (db: Db) => {
    db.collection(collections.mail).deleteMany({ '_id': { '$nin': mails } }, (error: any, docs: any) => {
      if (error) {
        errorQuery(context, 'Failed to clean mail');
        return context.done();
      } else {
        context.log('Mails deleted: ' + docs.result.n);
        context.done();
      }
    });
  };

  connectRead(context, findMails);
};
