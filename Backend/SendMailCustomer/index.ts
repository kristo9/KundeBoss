import { Context, HttpRequest } from '@azure/functions';
import { prepInput, returnResult, errorWrongInput, _idVal } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { connectRead, connectWrite, encryptReplyId } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';

const mailIdRand = 1000000;
const mailStartCount = 100000;

module.exports = (context: Context, req: HttpRequest): any => {
  req.body = prepInput(context, req.body);

  if (req.body === null) {
    return context.done();
  }

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

  const getReplyCount = (db) => {
    db.collection('mail').findOne({ '_id': 'replyCounter' }, { 'counter': 1 }, (error: any, docs: any) => {
      if (error) {
        errorQuery(context);
        return context.done();
      }
      if (docs === null) {
        mailCount = mailStartCount;
        db.collection('mail').insertOne({ '_id': 'replyCounter', 'counter': mailCount }, (error, docs) => {
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

  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      if (err) {
        errorUnauthorized(context, 'Token not valid'); /*TODO: appropriate error message, optional */
        return context.done();
      } else {
        db.collection('employee')
          .aggregate([
            {
              '$match': {
                'employeeId': decoded.preferred_username,
              },
            },
            {
              '$lookup': {
                'from': 'customer',
                'localField': 'customers.id',
                'foreignField': '_id',
                'as': 'customerInformation',
              },
            },
          ])
          .toArray((error: any, docs: any) => {
            docs = docs[0];
            let excpectedReceiverCount = 0;
            if (error) {
              errorQuery(context); /*TODO: appropriate error message, optional */
              return context.done();
            }

            let customer = docs.customerInformation.find((customer) => customer._id == req.body.customerId.id);
            let replyUrl = process.env['ApiReplyUrl'];
            let replyId = null;

            if (req.body.customerId.include === 'true') {
              excpectedReceiverCount = 1;
              replyId = encryptReplyId(mailCount++ * mailIdRand + Math.floor(Math.random() * mailIdRand));
              receiverMail.push({
                'to': [{ 'email': customer.contact.mail }],
                'subject': req.body.subject + ' <' + 'replyId:' + replyId + '>',
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

            if (req.body.supplierIds) {
              excpectedReceiverCount += req.body.supplierIds.length;
              customer.suppliers
                .filter((element: any) => JSON.stringify(req.body.supplierIds).includes(element.id))
                .forEach((supplier: any) => {
                  {
                    replyId = encryptReplyId(mailCount++ * mailIdRand + Math.floor(Math.random() * mailIdRand));
                    receiverMail.push({
                      'to': [{ 'email': supplier.contact.mail }],
                      'subject': req.body.subject + ' <' + 'replyId:' + replyId + '>',
                      'substitutions': {
                        '%replyUrl%': replyUrl + replyId,
                      },
                    });

                    receiverInformation.push({
                      'replyId': replyId,
                      'id': supplier.id,
                      'name': supplier.contact.name,
                      'reply': null,
                      'type': 'supplier',
                    });
                  }
                });
            }

            if (excpectedReceiverCount === receiverMail.length) {
              connectWrite(context, updateReplyCount);
            } else {
              errorQuery(context, 'User dont have access to given receivers');
              return context.done();
            }
          });
      }
    });
  };

  const updateReplyCount = (db) => {
    db.collection('mail').updateOne({ '_id': 'replyCounter' }, { '$set': { 'counter': mailCount } }, (error, docs) => {
      if (error) {
        console.log('error');
        return context.done();
      }
      connectRead(context, sendMail);
    });
  };

  let message = null;
  let mailGroup = null;

  const sendMail = (db: Db) => {
    db.collection('customer').findOne({ '_id': ObjectId(req.body.customerId.id) }, {}, (error: any, docs: any) => {
      if (error) {
        errorQuery(context);
        return context.done();
      }
      message = {
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
            'value':
              '<p>' +
              req.body.text +
              '</p><p>Følg linken eller svar på emailen for godkjenne.</p><a href=%replyUrl%>Acknowledge</a>',
          },
        ],
      };

      if (receiverMail.length > 0) {
        context.log('Sent mail to:' + JSON.stringify(receiverMail));
        context.bindings.resMail = message;
        mailGroup = docs.mailGroup;
        connectWrite(context, functionQuery);
      } else {
        errorWrongInput(context, 'no valid clients received');
        context.done();
      }
    });
  };

  const functionQuery = (db: Db) => {
    const newMail = {
      'date': new Date(),
      'receivers': receiverInformation,
      'subject': req.body.subject,
      'text': req.body.text,
    };

    db.collection('mail').insertOne(newMail, (error: any, docs: any) => {
      if (error) {
        context.bindings.resMail = null;
        errorQuery(context, 'Not able to insert new mail in db');
        return context.done();
      }

      db.collection('mailGroup').updateOne(
        { '_id': mailGroup },
        {
          '$push': {
            'mails': docs.insertedId,
          },
        },
        (error: any, docs: any) => {
          if (error) {
            context.bindings.resMail = null;
            errorQuery(context, 'Not able to update mailGroup in db');
            return context.done();
          }
          returnResult(context, docs);
          context.done();
        }
      );
    });
  };

  inputValidation();
};

/*
{
  "customerId": {"id":"","include":"true"/"false"},
  "supplierIds":[], Optional
  "text": "",
  "subject": ""
}
*/