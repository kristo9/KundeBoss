import { Context } from '@azure/functions';
import { errorQuery } from '../SharedFiles/auth';
import { collections, connectRead, connectWrite } from '../SharedFiles/dataBase';
import { Db } from '../SharedFiles/interfaces';

export default (context: Context, myTimer: any) => {
  let mailGroups = [];
  let mails = ['replyCounter'];

  const findMailGroups = (db: Db) => {
    db.collection(collections.customer)
      .find({})
      .project({ 'mailGroup': 1 })
      .toArray((error: any, docs: any) => {
        if (error) {
          errorQuery(context, 'Failed to query customer collection');
          return context.done();
        } else {
          docs.forEach((customer) => mailGroups.push(customer.mailGroup));
          db.collection(collections.supplier)
            .find({})
            .project({ 'mailGroup': 1 })
            .toArray((error: any, docs: any) => {
              if (error) {
                errorQuery(context, 'Failed to query supplier collection');
                return context.done();
              } else {
                docs.forEach((supplier) => mailGroups.push(supplier.mailGroup));
                findMails(db);
              }
            });
        }
      });
  };

  const findMails = (db: Db) => {
    db.collection(collections.mailGroup)
      .find({ '_id': { '$in': mailGroups } })
      .toArray((error: any, docs: any) => {
        if (error) {
          errorQuery(context, 'Failed to find mails');
          return context.done();
        } else {
          docs.forEach((mailGroup) => {
            mailGroup.mails.forEach((mail) => {
              mails.push(mail);
            });
          });
          connectWrite(context, cleanMails);
        }
      });
  };

  const cleanMails = (db: Db) => {
    db.collection(collections.mail).deleteMany({ '_id': { '$nin': mails } }, (error: any, docs: any) => {
      if (error) {
        errorQuery(context, 'Failed to clean mail');
        return context.done();
      } else {
        context.log('Mails deleted: ' + docs.result.n);
        cleanMailGroups(db);
      }
    });
  };

  const cleanMailGroups = (db: Db) => {
    db.collection(collections.mailGroup).deleteMany({ '_id': { '$nin': mailGroups } }, (error: any, docs: any) => {
      if (error) {
        errorQuery(context, 'Failed to clean mailGroup');
        return context.done();
      } else {
        context.log('MailGroups deleted: ' + docs.result.n);
        context.done();
      }
    });
  };
  connectRead(context, findMailGroups);
};
