import { Context, HttpRequest } from '@azure/functions';
import { prepInput, returnResult, errorWrongInput, _idVal } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { collections, connectRead, connectWrite, encryptReplyId } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';

const mailIdRand = 1000000;
const mailStartCount = 100000;

/**
 * @description Send mail to a customer and suppliers
 */
export default (context: Context, req: HttpRequest): any => {
  /* Sanitizes input. Returns if there are no request body */
  req.body = prepInput(context, req.body);
  if (req.body === null) {
    return context.done();
  }

  /* Checks that header includes a token. Returns if there are no token */
  let token = prepToken(context, req.headers.authorization);
  if (token === null) {
    return context.done();
  }

  const inputValidation = () => {
    let validInput = true;
    let errMsg = 'Error: ';

    let errSupId = req.body?.supplierIds?.find((supplierId) => !_idVal(supplierId));

    if (errSupId?.length > 0) {
      validInput = false;
      errMsg += 'Check supplierIds for error. \n';
    }

    if (!_idVal(req.body?.customerId?.id) || !req.body?.customerId?.include) {
      validInput = false;
      errMsg += 'CustomerId not found or invalid. \n';
    }

    if (!req.body?.text || !req.body?.subject) {
      validInput = false;
      errMsg += 'Text or subject not received.';
    }

    if (validInput) {
      connectWrite(context, getReplyCount);
    } else {
      errorWrongInput(context, errMsg);
      return context.done();
    }
  };
  let mailCount = null;

  /**
   * @description Finds the reply count in the database and updates the variable mailCount. Creates a Replycounter document if it doesn't exist.
   * @param db Database connection
   */
  const getReplyCount = (db) => {
    db.collection(collections.mail).findOne({ '_id': 'replyCounter' }, { 'counter': 1 }, (error: any, docs: any) => {
      if (error) {
        errorQuery(context);
        return context.done();
      }
      if (docs === null) {
        mailCount = mailStartCount;
        db.collection(collections.mail).insertOne({ '_id': 'replyCounter', 'counter': mailCount }, (error, docs) => {
          if (error) {
            errorQuery(context);
            return context.done();
          }
          connectRead(context, authorize);
        });
      } else {
        mailCount = docs.counter;
        connectRead(context, authorize);
      }
    });
  };

  let receiverMail = [];
  let receiverInformation = [];
  let senderName = null;
  let senderId = null;

  /**
   * @description Finds and returns a customer from the database.
   * @param db Database connection
   * @returns JSON
   */
  const getCustomer = (db) => {
    return new Promise((resolve) => {
      db.collection(collections.customer).findOne({ _id: ObjectId(req.body.customerId.id) }, {}, (error, docs) => {
        if (error) {
          errorQuery(context);
          resolve(null);
        } else {
          if (docs != null) {
            resolve(docs);
          } else {
            errorWrongInput(context, 'No customer found');
            resolve(null);
          }
        }
      });
    });
  };

  /**
   * @description Creates objects with mails to be sent, and data to be stored in the database
   * @param db
   */
  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        senderName = decoded.name;
        senderId = decoded.preferred_username;
        /* Finds all customer the employee have access to */
        db.collection(collections.employee)
          .aggregate([
            {
              '$match': {
                'employeeId': decoded.preferred_username,
              },
            },
            {
              '$lookup': {
                'from': collections.customer,
                'localField': 'customers.id',
                'foreignField': '_id',
                'as': 'customerInformation',
              },
            },
          ])
          .toArray(async (error: any, docs: any) => {
            docs = docs[0];
            let excpectedReceiverCount = 0;
            if (error) {
              errorQuery(context);
              return context.done();
            }
            let customer = null;
            /* Verifies that the employee have access to the customer that the mail is sent to */
            if (docs.admin === 'write') {
              customer = await getCustomer(db);
            } else {
              customer = docs.customerInformation.find((customer) => customer._id == req.body.customerId.id);
            }
            let replyUrl = process.env['ApiReplyUrl'];
            let replyId = null;

            if (!customer) {
              errorWrongInput(context);
              return context.done();
            }
            /* Prepares mail and database data for the customer, if the mail is to be sent to the customer */
            if (req.body.customerId.include === 'true') {
              excpectedReceiverCount = 1;
              replyId = encryptReplyId(mailCount++ * mailIdRand + Math.floor(Math.random() * mailIdRand));
              receiverMail.push({
                'to': [{ 'email': customer.contact.mail }],
                'subject': req.body.subject,
                'substitutions': {
                  '%replyUrl%': replyUrl + replyId,
                },
              });
              receiverInformation.push({
                'replyId': replyId,
                'id': ObjectId(customer._id.toString()),
                'name': customer.contact.name,
                'reply': null,
                'type': 'customer',
              });
            }
            /* Prepares mails and database data for the suppliers the mail will be sent to. */
            if (req.body.supplierIds) {
              excpectedReceiverCount += req.body.supplierIds.length;
              customer.suppliers
                .filter((element: any) => JSON.stringify(req.body.supplierIds).includes(element.id))
                .forEach((supplier: any) => {
                  {
                    replyId = encryptReplyId(mailCount++ * mailIdRand + Math.floor(Math.random() * mailIdRand));
                    receiverMail.push({
                      'to': [{ 'email': supplier.contact.mail }],
                      'subject': req.body.subject,
                      'substitutions': {
                        '%replyUrl%': replyUrl + replyId,
                      },
                    });

                    receiverInformation.push({
                      'replyId': replyId,
                      'id': supplier.id,
                      'name': supplier.name,
                      'reply': null,
                      'type': 'supplier',
                    });
                  }
                });
            }
            /* Checks that the amount of accual receivers and expected receivers are the same */
            if (excpectedReceiverCount === receiverMail.length) {
              connectWrite(context, updateReplyCount);
            } else {
              errorUnauthorized(context, 'User dont have access to given receivers');
              return context.done();
            }
          });
      }
    });
  };
  /**
   * @description Increases the reply count in the database
   * @param db
   */
  const updateReplyCount = (db) => {
    db.collection(collections.mail).updateOne(
      { '_id': 'replyCounter' },
      { '$set': { 'counter': mailCount } },
      (error, docs) => {
        if (error) {
          return context.done();
        }
        sendMail(db);
      }
    );
  };

  /**
   * @description Sends mail by inserting it in the bindings and inserts the mail into the database
   * @param db
   */
  const sendMail = (db: Db) => {
    const newMail = {
      'date': new Date(),
      'receivers': receiverInformation,
      'subject': req.body.subject,
      'text': req.body.text,
      'sender': senderName,
      senderId,
      'seenBy': [],
    };

    context.bindings.resMail = {
      'from': {
        'email': process.env['EmailAddress'],
      },
      'reply_to': {
        'email': process.env['EmailReplyAddress'],
      },
      'personalizations': receiverMail,
      'content': [
        {
          'type': 'text/html',
          'value': '<p>' + req.body.text + '</p><p>Følg linken for å svare</p><a href=%replyUrl%>Svar</a>',
        },
      ],
    };

    db.collection(collections.mail).insertOne(newMail, (error: any, docs: any) => {
      if (error) {
        context.bindings.resMail = null;
        errorQuery(context, 'Not able to insert new mail in db');
        return context.done();
      }

      db.collection(collections.customer).updateOne(
        { '_id': ObjectId(req.body.customerId.id) },
        {
          '$push': {
            'mails': docs.insertedId,
          },
        }
      );
      {
        if (error) {
          context.bindings.resMail = null;
          errorQuery(context, 'Not able to update customer in db');
          return context.done();
        }
        returnResult(context, docs);
        context.done();
      }
    });
  };

  inputValidation();
};
