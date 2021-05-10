import { Context } from '@azure/functions';

const sanitize = require('sanitize-html');

/**
 * @description Sanitizes JSON and JSON[] objects
 * @param data: JSON | JSON[]
 * @returns JSON | JSON[]
 */
const sanitizeHtmlJson = (data: JSON | JSON[]) => {
  let iterate = (itData) => {
    if (itData){
      Object.keys(itData).forEach((key) => {
        if (typeof itData[key] === 'object') {
          itData[key] = iterate(itData[key]);
        } else if (typeof itData[key] === 'string') {
          itData[key] = sanitize(itData[key]);
        }
      });
    }
    return itData;
  };
  return JSON.parse(sanitize(JSON.stringify(iterate(data))));
};

/**
 * @description Returns true if name has passes regex test
 * @param name: string
 * @returns bool
 */
export const nameVal = (name: string) =>
  typeof name === 'string'
    ? name.match(
        /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
      ) != null
    : false;

/**
 * @description Returns true if phoneVal has passes regex test
 * @param number: any
 * @returns bool
 */
export const phoneVal = (number: any) => number.toString().match(/^[+]{1}[0-9]{10}$|^[0-9]{8}$|^[0-9]{12}$/) != null;

/**
 * @description Returns true if mail has passes regex test
 * @param mail: string
 * @returns bool
 */
export const mailVal = (mail: string) =>
  typeof mail === 'string'
    ? mail.match(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      ) != null
    : false;

/**
 * @description Returns true if _id passes regex test. _id is a mongodb ObjectId
 * @param _id: string
 * @returns bool
 */
export const _idVal = (_id: string) => (typeof _id === 'string' ? _id.match(/^[0-9a-f]{24}$/) != null : false);

/**
 * @description Sanitizes data, sets context.res.status to 200 and context.res.body to data
 * @param context: Context
 * @param data: JSON | JSON[]
 */
export const returnResult = (context: Context, data: JSON | JSON[]) => {
  data = sanitizeHtmlJson(data);
  context.log('Success!');
  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  };
};

/**
 * @description Sanitizes data and returns it. If data is null, context.res.status is sett to 400 and function returns null
 * @param context: Context
 * @param data: JSON | JSON[]
 * @returns JSON | JSON[] or null
 */
export const prepInput = (context: Context, data: JSON | JSON[]) => {
  if (data === null || Object.keys(data).length == 0) {
    context.res = {
      status: 400,
      body: 'no body',
    };
    return null;
  } else {
    context.log(JSON.stringify(data, null, 2));
    return sanitizeHtmlJson(data);
  }
};

/**
 * @description Sets context.res.status to 400, and context.res.body errorMsg.
 * @param context: Context
 * @param errorMsg: string = 'Wring data'
 */
export const errorWrongInput = (context: Context, errorMsg: string = 'Wrong data') => {
  context.res = {
    status: 400,
    body: errorMsg,
  };
  context.log(errorMsg);
};
