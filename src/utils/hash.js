// src/utils/hash.js
const canonical = require('canonical-json');
const crypto = require('crypto');

function canonicalHash(obj) {
  const canon = canonical(obj);
  return crypto.createHash('sha256').update(canon).digest('hex');
}

module.exports = { canonicalHash };
