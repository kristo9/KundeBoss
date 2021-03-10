import { Context, HttpRequest } from '@azure/functions';
import { connectRead } from '../SharedFiles/dataBase';
import { Db } from '../SharedFiles/interfaces';

//TestFunction with the purpose of checking if testing was working, no practical use other than this
/**
 *
 * @param context H
 * @param req any
 */
const testFunction = (context: any, req: HttpRequest) => {
  const dostuff = (db: Db = null) => {
    context.res = {
      'status': 200,
      'body': 'Sea shanty',
    };
    context.done();
  };

  //connectRead(context, dostuff, true);
  dostuff();
};

export default testFunction;
