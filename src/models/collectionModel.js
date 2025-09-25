// src/models/collectionModel.js
const db = require('../config/db');

async function insertCollectionEvent(event, blockchain_txid, blockchain_hash) {
  const sql = `INSERT INTO collection_events (
    event_id, timestamp, collector_id, collector_name, latitude, longitude, accuracy, altitude,
    species_common, species_scientific, quantity_kg, harvest_method, moisture, ash, visual_quality,
    contamination_present, photos, weather, notes, blockchain_txid, blockchain_hash
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  const photos = event.photos ? JSON.stringify(event.photos) : null;

  const params = [
    event.event_id,
    event.timestamp,
    event.collector && event.collector.collector_id,
    event.collector && event.collector.name,
    event.location && event.location.latitude,
    event.location && event.location.longitude,
    event.location && event.location.accuracy,
    event.location && event.location.altitude,
    event.species && event.species.common_name,
    event.species && event.species.scientific_name,
    event.quantity_kg,
    event.harvest_method,
    event.quality_metrics && event.quality_metrics.moisture_content,
    event.quality_metrics && event.quality_metrics.ash_content,
    event.quality_metrics && event.quality_metrics.visual_quality_score,
    event.quality_metrics && event.quality_metrics.contamination_present,
    photos,
    event.weather_conditions,
    event.notes,
    blockchain_txid,
    blockchain_hash
  ];

  const [result] = await db.execute(sql, params);
  return result;
}

async function getCollectionEventById(id) {
  const [rows] = await db.execute('SELECT * FROM collection_events WHERE event_id = ?', [id]);
  if (rows.length === 0) return null;
  if (rows[0].photos) rows[0].photos = JSON.parse(rows[0].photos);
  return rows[0];
}

module.exports = { insertCollectionEvent, getCollectionEventById };
