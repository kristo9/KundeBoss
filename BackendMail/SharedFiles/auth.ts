import { Context } from '@azure/functions';

/**
 * @description Sets status and result body when db query failes
 * @param context
 * @param errorMsg
 */
export const errorQuery = (context: Context, errorMsg: string = 'Error running query') => {
  context.log(errorMsg);
  context.res = {
    status: 500,
    'headers': {
      'Content-Type': 'application/json',
    },
    body: errorMsg,
  };
};
