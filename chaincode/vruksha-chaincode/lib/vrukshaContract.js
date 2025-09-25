'use strict';
const { Contract } = require('fabric-contract-api');

class VrukshaContract extends Contract {

  async initLedger(ctx) {
    // optional seeding
    console.info('Ledger initialized');
  }

  // payload is JSON string: { event: {...}, meta: { hash, signature, creator } }
  async recordCollectionEvent(ctx, eventId, payloadStr) {
    const exists = await ctx.stub.getState(eventId);
    if (exists && exists.length > 0) {
      throw new Error(`Event ${eventId} already exists`);
    }
    // Basic role enforcement (reads role attribute from client cert)
    const cid = ctx.clientIdentity;
    const role = cid.getAttributeValue('role') || cid.getMSPID();
    // allow if role contains harvester/registrar/appUser (customize as enroll attrs)
    if (!['harvester', 'registrar', 'appUser'].includes(role) && !role.includes('Org1MSP')) {
      // org MSP fallback for simple test networks
      throw new Error(`Access denied for role ${role}`);
    }

    // store event payload
    await ctx.stub.putState(eventId, Buffer.from(payloadStr));
    // return tx id as confirmation
    return JSON.stringify({ eventId, txId: ctx.stub.getTxID() });
  }

  async queryCollectionEvent(ctx, eventId) {
    const data = await ctx.stub.getState(eventId);
    if (!data || data.length === 0) {
      throw new Error(`Event ${eventId} not found`);
    }
    return data.toString();
  }

  async getHistory(ctx, eventId) {
    const iterator = await ctx.stub.getHistoryForKey(eventId);
    const results = [];
    let res = await iterator.next();
    while (!res.done) {
      const item = res.value;
      results.push({
        txId: item.txId,
        timestamp: item.timestamp,
        isDelete: item.isDelete,
        value: item.value.toString('utf8')
      });
      res = await iterator.next();
    }
    await iterator.close();
    return JSON.stringify(results);
  }
}

module.exports = VrukshaContract;
