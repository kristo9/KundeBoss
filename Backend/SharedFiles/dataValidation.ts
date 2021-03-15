import { Context } from '@azure/functions';

const sanitize = require('sanitize-html');

//const sanitizeHtml = (input: string) => sanitize(input);
/**
 * @description Sanitizes JSON and JSON[] objects
 * @param input: JSON | JSON[]
 * @returns JSON | JSON[]
 */
const sanitizeHtmlJson = (input: JSON | JSON[]) => JSON.parse(sanitize(JSON.stringify(input)));

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
    'status': 200,
    'headers': {
      'Content-Type': 'application/json',
    },
    'body': data,
  };
};

/**
 * @description Sanitizes input and returns it. If input is null, context.res.status is sett to 400 and function returns null
 * @param context: Context
 * @param data: JSON | JSON[]
 * @returns JSON | JSON[] or null
 */
export const prepInput = (context: Context, input: JSON | JSON[]) => {
  if (input) {
    return sanitizeHtmlJson(input);
  } else {
    context.res = {
      'status': 400,
      'body': 'no body',
    };
    return null;
  }
};

/**
 * @description Sets context.res.status to 400, and context.res.body errorMsg.
 * @param context: Context
 * @param errorMsg: string = 'Wring input'
 */
export const errorWrongInput = (context: Context, errorMsg: string = 'Wrong input') => {
  context.res = {
    'status': 400,
    'body': errorMsg,
  };
  context.log(errorMsg);
};
