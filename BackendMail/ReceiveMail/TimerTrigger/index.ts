import { Context } from '@azure/functions';

export default (context: Context, myTimer: any) => {
  var timeStamp = new Date().toISOString();

  if (myTimer.isPastDue) {
    context.log('Timer function is running late!');
  }
  context.log('Timer trigger function ran!', timeStamp);
};
