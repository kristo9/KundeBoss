"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectWrite = exports.clientWrite = exports.collections = void 0;
const MongoClient = require('mongodb').MongoClient;
const config = {
    'useNewUrlParser': true,
    'useUnifiedTopology': true,
};
const uriWrite = process.env['UriWrite'];
const DBName = 'KundebossDB';
exports.collections = {
    customer: 'customer',
    employee: 'employee',
    mail: 'mail',
    mailGroup: 'mailGroup',
    supplier: 'supplier',
    customerType: 'customerType',
};
exports.clientWrite = null;
/**
 * @description If function succesfully connects to db, or db connection is already availible, function calls callback function with db connection as parameter
 * @param context: Context
 * @param callback: (any) => void
 * @param overrideTest: bool = false. Makes function create new connection when a connection is availible
 */
function connectWrite(context, callback, overrideTest = false) {
    context.log('Connecting write client');
    if (exports.clientWrite == null || overrideTest) {
        MongoClient.connect(uriWrite, config, (error, _client) => {
            if (error) {
                context.log('Failed to connect write client');
                context.res = {
                    status: 500,
                    body: 'Failed to connect write client',
                };
                return context.done();
            }
            exports.clientWrite = _client;
            context.log('Connected write client');
            callback(exports.clientWrite.db(DBName));
        });
    }
    else {
        callback(exports.clientWrite.db(DBName));
    }
}
exports.connectWrite = connectWrite;
//# sourceMappingURL=dataBase.js.map