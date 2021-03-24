import { Context } from '@azure/functions';

const tenantID = '301091f0-e24f-43fa-bd87-59350cc3fbb6';
const authority = 'login.microsoftonline.com';
const version = 'v2.0';
const jwksUri = `https://${authority}/${tenantID}/discovery/${version}/keys`;
const issuer = `https://${authority}/${tenantID}/${version}`;
const audience = '6bb502c3-c416-44f7-97cb-705b2b1a50ba';

let jwksClient = require('jwks-rsa');

let client = jwksClient({
  jwksUri: jwksUri,
});

let signingKey = null;

export const options = {
  audience: audience,
  issuer: issuer,
};

/**
 * @description gets key for validating token, then calls callback function
 * @param header
 * @param callback
 */
export const getKey = (header: any, callback: (arg0: any, arg1: any) => void) => {
  if (signingKey == null) {
    client.getSigningKey(header.kid, (err: any, key: { publicKey: any }) => {
      signingKey = key.publicKey;
      callback(null, signingKey);
    });
  } else {
    callback(null, signingKey);
  }
};

/**
 * @description Prepares token for validation
 * @param context
 * @param token
 * @returns token
 */
export const prepToken = (context: Context, token: string) => {
  if (token) {
    return token.replace(/^Bearer\s+/, '');
  } else {
    context.res = {
      status: 400,
      body: 'no token',
    };
    return null;
  }
};

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

/**
 * @description Sets status and result body when authorization failes
 * @param context
 * @param errorMsg
 */
export const errorUnauthorized = (context: Context, errorMsg: string = 'Unauthorized') => {
  signingKey = null;

  context.res = {
    'headers': {
      'Content-Type': 'application/json',
    },
    status: 401,
    body: errorMsg,
  };
  context.log(errorMsg);
};
