// src/utils/signVerify.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PRIV_KEY_PATH = process.env.SERVER_PRIVATE_KEY_PATH || path.resolve(process.cwd(), 'keys', 'server_private.pem');
const PUB_KEY_PATH = process.env.SERVER_PUBLIC_KEY_PATH || path.resolve(process.cwd(), 'keys', 'server_public.pem');

function signHex(hexString) {
  const privateKey = fs.readFileSync(PRIV_KEY_PATH, 'utf8');
  const sign = crypto.createSign('SHA256');
  sign.update(hexString);
  sign.end();
  const signature = sign.sign(privateKey, 'base64');
  return signature;
}

function verifyHex(hexString, signature) {
  const publicKey = fs.readFileSync(PUB_KEY_PATH, 'utf8');
  const verify = crypto.createVerify('SHA256');
  verify.update(hexString);
  verify.end();
  return verify.verify(publicKey, signature, 'base64');
}

module.exports = { signHex, verifyHex };
