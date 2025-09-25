// src/controllers/collectionController.js
'use strict';
const { canonicalHash } = require('../utils/hash');
const { signHex } = require('../utils/signVerify');
const { getGatewayAndContract } = require('../config/fabricConnection');
const db = require('../config/db'); // your DB module (sqlite/mysql) - used for storing reference records

// adapt insertion to your DB model (if using sqlite or json store)
async function saveToLocalDB(event, txId, hash) {
  // example using sqlite 'db' exported as sqlite3 Database (if you followed earlier setup)
  // If using lowdb or MySQL, update accordingly.
  try {
    if (!db) return;
    const photos = event.photos ? JSON.stringify(event.photos) : null;
    // if sqlite3 (callback API) use run; if mysql promise use execute
    if (db.run) {
      const sql = `INSERT INTO collection_events (event_id,timestamp,collector_id,collector_name,latitude,longitude,species_common,species_scientific,quantity_kg,harvest_method,moisture,ash,visual_quality,contamination_present,photos,weather,notes,blockchain_txid,blockchain_hash)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      db.run(sql, [
        event.event_id, event.timestamp, event.collector.collector_id, event.collector.name,
        event.location.latitude, event.location.longitude,
        event.species.common_name, event.species.scientific_name,
        event.quantity_kg, event.harvest_method,
        event.quality_metrics && event.quality_metrics.moisture_content,
        event.quality_metrics && event.quality_metrics.ash_content,
        event.quality_metrics && event.quality_metrics.visual_quality_score,
        event.quality_metrics && event.quality_metrics.contamination_present,
        photos, event.weather_conditions, event.notes, txId, hash
      ], function(err) {
        if (err) console.error('DB insert error', err);
      });
    } else {
      // example for mysql2 promise pool
      const sql = `INSERT INTO collection_events (event_id, timestamp, collector_id, collector_name, latitude, longitude, species_common, species_scientific, quantity_kg, harvest_method, moisture, ash, visual_quality, contamination_present, photos, weather, notes, blockchain_txid, blockchain_hash)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      await db.execute(sql, [
        event.event_id, event.timestamp, event.collector.collector_id, event.collector.name,
        event.location.latitude, event.location.longitude,
        event.species.common_name, event.species.scientific_name,
        event.quantity_kg, event.harvest_method,
        event.quality_metrics && event.quality_metrics.moisture_content,
        event.quality_metrics && event.quality_metrics.ash_content,
        event.quality_metrics && event.quality_metrics.visual_quality_score,
        event.quality_metrics && event.quality_metrics.contamination_present,
        photos, event.weather_conditions, event.notes, txId, hash
      ]);
    }
  } catch (err) {
    console.error('saveToLocalDB error', err);
  }
}

async function createCollectionEvent(req, res) {
  try {
    const body = req.body;
    const event = body.event || body; // support both shapes
    if (!event || !event.event_id) return res.status(400).json({ error: 'event missing' });

    // 1) canonicalize and hash
    const hash = canonicalHash(event);

    // 2) sign the hash (server signature)
    const signature = signHex(hash);

    // 3) Build chain payload: include event + meta (hash+signature+creator)
    const payload = { event, meta: { hash, signature, creator: body.creator || 'appUser' } };

    // 4) submit transaction to Fabric
    const identityLabel = body.identity || (req.headers['x-identity'] || 'appUser');
    const { gateway, contract } = await getGatewayAndContract(identityLabel);

    // submit; chaincode function recordCollectionEvent(eventId, payloadStr)
    const txResponse = await contract.submitTransaction('recordCollectionEvent', event.event_id, JSON.stringify(payload));
    // txResponse may contain bytes; call toString()
    const txString = txResponse ? txResponse.toString() : null;

    // 5) store a reference locally (db) for quick reads
    await saveToLocalDB(event, txString, hash);

    // 6) disconnect gateway
    await gateway.disconnect();

    return res.json({ success: true, tx: txString, hash, signature });
  } catch (err) {
    console.error('createCollectionEvent error', err);
    return res.status(500).json({ error: err.message });
  }
}

async function getCollectionEvent(req, res) {
  try {
    const id = req.params.id;
    // try chain query first
    const identityLabel = req.headers['x-identity'] || 'appUser';
    const { gateway, contract } = await getGatewayAndContract(identityLabel);
    const data = await contract.evaluateTransaction('queryCollectionEvent', id);
    await gateway.disconnect();
    if (!data) return res.status(404).json({ error: 'not found on chain' });
    return res.json(JSON.parse(data.toString()));
  } catch (err) {
    console.error('getCollectionEvent err', err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { createCollectionEvent, getCollectionEvent };
