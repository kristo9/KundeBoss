import { Context } from '@azure/functions';
const crypto = require('crypto');

const MongoClient = require('mongodb').MongoClient;
const config = {
  'useNewUrlParser': true,
  'useUnifiedTopology': true,
};
//const ObjectId = require("mongodb").ObjectID;
const uriRead = process.env['UriRead'];
const uriWrite = process.env['UriWrite'];
//module.exports.uriRead = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
//module.exports.clientRead = () => this.MongoClient(this.uriRead).connect(); //serverSelectionTimeoutMS: 10000, useUnifiedTopology: true, useNewUriParser: true
const DBName = 'KundebossDB';

export const collections = {
  customer: 'customer',
  employee: 'employee',
  mail: 'mail',
  mailGroup: 'mailGroup',
  supplier: 'supplier',
  customerCategory: 'customerCategory',
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

/**
 * @description If function succesfully connects to db, or db connection is already availible, function calls callback function with db connection as parameter
 * @param context: Context
 * @param callback: (any) => void
 * @param overrideTest: bool = false. Makes function create new connection when a connection is availible
 */
export function connectWrite(context: Context, callback: (arg0: any) => void, overrideTest = false) {
  context.log('Connecting write client');

  if (clientWrite == null || overrideTest) {
    MongoClient.connect(uriWrite, config, (error: any, _client: any) => {
      if (error) {
        context.log('Failed to connect write client');
        context.res = {
          status: 500,
          body: 'Failed to connect write client',
        };
        return context.done();
      }
      clientWrite = _client;

      context.log('Connected write client');
      callback(clientWrite.db(DBName));
    });
  } else {
    callback(clientWrite.db(DBName));
  }
}

export const checkDbConnection = (context: Context, connection: any) => {
  if (connection) {
    context.log('Reusing open db connection');
  } else {
    context.log('No reuseable db connection');
  }
};

const algorithm = 'aes-256-ctr';
const secretKey = process.env['EncryptionKey'];
const iv = Buffer.from(process.env['EncryptionIv']);

/**
 * @description Encripts id
 * @param id
 * @returns : string('hex')
 */
export const encryptReplyId = (id: number) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(id.toString()), cipher.final()]);

  return encrypted.toString('hex');
};

export const closeConnections = () => {
  clientRead?.close();
  clientWrite?.close();
  clientRead = null;
  clientWrite = null;
};
