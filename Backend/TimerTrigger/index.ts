import { Context } from '@azure/functions';
import { checkDbConnection, clientRead, connectRead } from '../SharedFiles/dataBase';

export default (context: Context, myTimer: any) => {
  checkDbConnection(context, clientRead);
  // Connecting du db to prevent cold start
  const timeStamp = new Date().toISOString();

  if (myTimer.isPastDue) {
    context.log('Timer function is running late!');
  }
  context.log('Timer trigger function ran!', timeStamp);

  connectRead(context, () => context.done(), true);
};
