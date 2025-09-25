const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Load signing keys
const privateKeyPath = path.join(__dirname, '../../keys/server_private.pem');
const publicKeyPath = path.join(__dirname, '../../keys/server_public.pem');

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

// 🔹 POST → Create collection event
router.post('/', (req, res) => {
  const event = req.body;

  if (!event || !event.event_id) {
    return res.status(400).json({ error: "event missing" });
  }

  // Create blockchain-like immutable hash
  const blockchainHash = crypto.createHash("sha256")
    .update(JSON.stringify(event))
    .digest("hex");

  // Sign the hash with server private key
  const sign = crypto.createSign("SHA256");
  sign.update(blockchainHash);
  sign.end();
  const signature = sign.sign(privateKey, "base64");

  // Verify signature with public key (for proof)
  const verify = crypto.createVerify("SHA256");
  verify.update(blockchainHash);
  verify.end();
  const isValid = verify.verify(publicKey, signature, "base64");

  res.json({
    success: true,
    message: "Collection event recorded",
    blockchainTxId: blockchainHash.substring(0, 12), // mock tx ID
    blockchainHash,
    signature,
    signatureValid: isValid,
    storedEvent: {
      event_id: event.event_id,
      species: event.species?.common_name || "unknown",
      quantity_kg: event.quantity_kg
    }
  });
});

// 🔹 GET → Retrieve collection event (mock + blockchain hash)
router.get('/:id', (req, res) => {
  const { id } = req.params;

  res.json({
    event_id: id,
    collector: { collector_id: "F001", name: "Ramesh" },
    species: { common_name: "Ashwagandha" },
    quantity_kg: 25,
    blockchainHash: "abc123hash"
  });
});

module.exports = router;
