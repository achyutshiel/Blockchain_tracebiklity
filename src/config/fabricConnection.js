// src/config/fabricConnection.js
'use strict';
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const CCP_PATH = process.env.FABRIC_CONNECTION_PROFILE_PATH || path.resolve(process.cwd(), 'fabric', 'connection-org1.json'); 
const WALLET_PATH = process.env.WALLET_PATH || path.resolve(process.cwd(), 'wallet'); // directory with identities
const CHANNEL_NAME = process.env.FABRIC_CHANNEL || 'mychannel';
const CHAINCODE_NAME = process.env.FABRIC_CHAINCODE_NAME || 'vruksha';

async function getGatewayAndContract(identityLabel = 'appUser') {
  // load connection profile
  if (!fs.existsSync(CCP_PATH)) throw new Error(`Connection profile not found at ${CCP_PATH}`);
  const ccp = JSON.parse(fs.readFileSync(CCP_PATH, 'utf8'));

  // load wallet
  const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);
  const gateway = new Gateway();

  await gateway.connect(ccp, {
    wallet,
    identity: identityLabel,
    discovery: { enabled: true, asLocalhost: true }
  });

  const network = await gateway.getNetwork(CHANNEL_NAME);
  const contract = network.getContract(CHAINCODE_NAME);

  return { gateway, contract };
}

module.exports = { getGatewayAndContract };
