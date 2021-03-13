import { Context, HttpRequest } from '@azure/functions';
import { prepInput, returnResult, errorWrongInput, _idVal } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { connectRead, connectWrite } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';
import { encrypt } from '../SharedFiles/crypto';

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
      connectWrite(context, getResponseCount);
    } else {
      errorWrongInput(context, errMsg);
      return context.done();
    }
  };
  let mailId = null;

  const getResponseCount = (db) => {
    db.collection('mail').findOne({ '_id': 'encodedResponseId' }, { 'counter': 1 }, (error: any, docs: any) => {
      if (error) {
        console.log('error');
        return context.done();
      }
      if (docs === null) {
        mailId = 1000000;
        db.collection('mail').insertOne({ '_id': 'encodedResponseId', 'counter': mailId }, (error, docs) => {
          if (error) {
            console.log('error');
            return context.done();
          }
          connectRead(context, authorize);
        });
      } else {
        mailId = docs.counter;
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

            if (req.body.customerId.include === 'true') {
              excpectedReceiverCount = 1;
              let encodedResponseId = encrypt(mailId++);

              receiverMail.push({
                'to': [{ 'email': customer.contact.mail }],
                'headers': {
                  'responseId': encodedResponseId,
                },
              });
              receiverInformation.push({
                'mailId': mailId,
                'id': customer._id.toString(),
                'name': customer.contact.name,
                'response': null,
                'type': 'customer',
              });
            }

            if (req.body.supplierIds) {
              excpectedReceiverCount += req.body.supplierIds.length;
              customer.suppliers
                .filter((element: any) => JSON.stringify(req.body.supplierIds).includes(element.id))
                .forEach((supplier: any) => {
                  {
                    let encodedResponseId = encrypt(mailId++);
                    receiverMail.push({
                      'to': [{ 'email': supplier.contact.mail }],
                      'headers': {
                        'responseId': encodedResponseId,
                      },
                    });

                    receiverInformation.push({
                      'mailId': mailId,
                      'id': supplier.id,
                      'name': supplier.contact.name,
                      'response': null,
                      'type': 'supplier',
                    });
                  }
                });
            }

            if (excpectedReceiverCount === receiverMail.length) {
              connectWrite(context, updateResponseCount);
            } else {
              errorQuery(context, 'User dont have access to given receivers');
              return context.done();
            }
          });
      }
    });
  };

  const updateResponseCount = (db) => {
    db.collection('mail').updateOne(
      { '_id': 'encodedResponseId' },
      { '$set': { 'counter': mailId } },
      (error, docs) => {
        if (error) {
          console.log('error');
          return context.done();
        }
        connectRead(context, sendMail);
      }
    );
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
        'personalizations': receiverMail,
        from: { email: process.env['EmailAddress'] },
        subject: req.body.subject,
        content: [
          {
            type: 'text/plain',
            value: req.body.text,
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
      'subject': message.subject,
      'text': message.content[0].value,
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
          $push: {
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
/* {
  'to': [{ 'email': customer.suppliers[i].contact.mail }],
  'headers': { 'customerId': 'val' },
} */
