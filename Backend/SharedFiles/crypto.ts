import crypt = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = process.env['EncryptionKey'];
const iv = crypt.randomBytes(16);

export const encrypt = (id: number) => {
  const cipher = crypt.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(id.toString()), cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (hash) => {
  let textParts = hash.split(':');

  hash = {
    iv: textParts[0],
    content: textParts[1],
  };

  const decipher = crypt.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

  return parseInt(decrpyted.toString(), 10);
};
