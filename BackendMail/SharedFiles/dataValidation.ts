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
