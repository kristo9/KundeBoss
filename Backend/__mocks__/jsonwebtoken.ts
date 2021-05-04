const preferred_username = require('../tests/sharedItems').preferred_username;

export const verify = (token, b, c, callback) => {
  if (token?.length === 0) {
    callback('Error no id', {});
  }
  token = token.replace('Bearer ', '');
  callback(null, { name: 'Didrik', roles: [], preferred_username: token });
};