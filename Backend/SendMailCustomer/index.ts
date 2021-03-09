import { Context, HttpRequest } from '@azure/functions';
import { prepInput, returnResult, errorWrongInput, _idVal } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { connectRead, connectWrite } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';

module.exports = (context: Context, req: HttpRequest): any => {
  req.body = prepInput(context, req.body);

  if (req.body === null) {
    return context.done();
  }

  let token = prepToken(context, req.headers.authorization);
  let decodedToken = null;
  if (token === null) {
    return context.done();
  }

  const inputValidation = () => {
    let validInput = true;
    let errMsg = 'Error: ';

    if (!_idVal(req.body?.customerId?.id) || !req.body?.customerId?.include) {
      validInput = false;
      errMsg += 'CustomerId not found or invalid. \n';
    }
    if (req.body?.supplierIds?.length > 0) {
      for (let i = 0; i < req.body.supplierIds.length; ++i) {
        if (!_idVal(req.body.supplierIds[i])) {
          validInput = false;
          errMsg += 'Check supplierIds for error. \n';
          break;
        }
      }
    }
    if (!req.body?.from || !req.body?.text || !req.body?.subject) {
      validInput = false;
      errMsg += 'From, text or subject not received.';
    }

    if (validInput) {
      connectRead(context, authorize);
    } else {
      errorWrongInput(context, errMsg); /*TODO: appropriate error message, optional */
      return context.done();
    }
  };

  let receiverMail = [];
  let receiverInformation = [];

  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      if (err) {
        errorUnauthorized(context, 'Token not valid'); /*TODO: appropriate error message, optional */
        return context.done();
      } else {
        /* TODO: Verify that user has permission to do what is asked
                    example for checking if user have admin-write permission */
        decodedToken = decoded;
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
            let customer = null;
            let excpectedReceiverCount = 0;
            if (error) {
              errorQuery(context); /*TODO: appropriate error message, optional */
              return context.done();
            }

            for (let i = 0; i < docs.customerInformation.length; ++i) {
              if (docs.customerInformation[i]._id == req.body.customerId.id) {
                customer = docs.customerInformation[i];
                if (req.body.customerId.include === 'true') {
                  excpectedReceiverCount = 1;
                  receiverMail.push({ 'email': customer.contact.mail });
                  receiverInformation.push({
                    'id': customer._id.toString(),
                    'name': customer.contact.name,
                    'response': null,
                    'type': 'customer',
                  });
                }
                break;
              }
            }

            //console.log(JSON.stringify(customer, null, 2));

            if (req.body.supplierIds) {
              for (let i = 0; i < customer.suppliers.length; ++i) {
                for (let j = 0; j < req.body.supplierIds.length; ++j) {
                  if (req.body.supplierIds[j] == customer.suppliers[i].id) {
                    receiverMail.push({ 'email': customer.suppliers[i].contactPerson.mail });
                    receiverInformation.push({
                      'id': customer.suppliers[i].id,
                      'name': customer.suppliers[i].contactPerson.name,
                      'response': null,
                      'type': 'supplier',
                    });
                    excpectedReceiverCount += 1;
                    break;
                  }
                }
              }
            }

            if (excpectedReceiverCount === receiverMail.length) {
              connectRead(context, sendMail);
            } else {
              errorQuery(context, 'User dont have access to given receivers');
              return context.done();
            }
          });
      }
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
        'personalizations': [{ 'to': receiverMail }],
        from: { email: req.body.from /*decodedToken.preferred_username*/ },
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

    db.collection('mailGroup').updateOne(
      { '_id': mailGroup },
      {
        $push: {
          'mails': newMail,
        },
      },
      (error: any, docs: any) => {
        if (error) {
          context.bindings.resMail = null;
          return context.done();
        }
        returnResult(context, docs);
        context.done();
      }
    );
  };

  inputValidation();
};

/*
{
  "customerId": {"id":"","include":"true"/"false"},
  "supplierIds":[], Optional
  "from":"",
  "text": "",
  "subject": ""
}
*/
