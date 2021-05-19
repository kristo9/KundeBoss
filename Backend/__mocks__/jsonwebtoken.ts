export const verify = (token, b, c, callback) => {
  if (token?.length === 0) {
    callback('Error no id', {});
  } else if (token == 'test') {
    callback('Error no id', { name: 'Name', roles: [], preferred_username: 'Username' });
  } else {
    token = token.replace('Bearer ', '');
    callback(null, { name: 'Name', roles: [], preferred_username: token });
  }
};
