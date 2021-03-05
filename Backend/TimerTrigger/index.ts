import { Context } from '@azure/functions';
import { connectRead } from '../SharedFiles/dataBase';
import { Db } from '../SharedFiles/interfaces';

export default (context: Context, myTimer: any) => {
  // Connecting du db to prevent cold start
  const timeStamp = new Date().toISOString();

  if (myTimer.isPastDue) {
    context.log('Timer function is running late!');
  }
  context.log('Timer trigger function ran!', timeStamp);

  connectRead(
    context,
    (db: Db) => {
      db.collection('employee')
        .find()
        .project({ '_id': 0, 'employeeId': 1 })
        .toArray((error: any, docs: JSON[]) => {
          if (error) {
            context.log('Error running query');
          } else {
            context.log('Employees in db: ' + docs.length);
          }
          context.done();
        });
    },
    true
  );
};
