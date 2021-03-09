import { Context, HttpRequest } from '@azure/functions';
import { Db } from '../SharedFiles/interfaces';

const testFunction = (context: Context, req: HttpRequest): any => {
  const dostuff = (db: Db = null) => {
    context.res = {
      'status': 200,
      'body': 'Sea shanty',
    };
    context.done;
  };

  dostuff();
};

export default testFunction;
