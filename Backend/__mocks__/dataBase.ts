jest.mock('mongodb');
import { Context } from '@azure/functions';

const MongoClient = require('mongodb').MongoClient;
const config = {
  'useNewUrlParser': true,
  'useUnifiedTopology': true,
};
const uriRead = process.env['UriRead'];
const uriWrite = process.env['UriWrite'];
const DBName = 'KundebossDB';

export const collections = {
  customer: 'customer',
  employee: 'employee',
  mail: 'mail',
  mailGroup: 'mailGroup',
  supplier: 'supplier',
};

export let clientRead = null;
export let clientWrite = null;

/**
 * @description If function succesfully connects to db, or db connection is already availible, function calls callback function with db connection as parameter. Only used for reading
 * @param context: Context
 * @param callback: (any) => void
 * @param overrideTest: bool = false. Makes function create new connection when a connection is availible
 */
export function connectRead(context: Context, callback: (arg0: any) => void, overrideTest = false) {
  context.log('Connecting read client');

  if (clientRead == null || overrideTest) {
    MongoClient.connect(uriRead, config, (error: any, _client: any) => {
      if (error) {
        context.log('Failed to connect read client');
        context.res = {
          'status': 500,
          'body': 'Failed to connect read client',
        };
        return context.done();
      }
      clientRead = _client;

      context.log('Connected read client');
      callback(clientRead.db(DBName));
    });
  } else {
    callback(clientRead.db(DBName));
  }
}
