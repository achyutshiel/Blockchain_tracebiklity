// src/config/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// DB file inside project
const dbPath = path.resolve(__dirname, '../../vrukshachain.db');
const db = new sqlite3.Database(dbPath);

// Auto-create schema
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      contact TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS collection_events (
      event_id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      collector_id TEXT NOT NULL,
      collector_name TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      species_common TEXT,
      species_scientific TEXT,
      quantity_kg REAL,
      harvest_method TEXT,
      moisture REAL,
      ash REAL,
      visual_quality INTEGER,
      contamination_present BOOLEAN,
      photos TEXT,
      weather TEXT,
      notes TEXT,
      blockchain_txid TEXT,
      blockchain_hash TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS product_batches (
      id TEXT PRIMARY KEY,
      manufacturer_id TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      linked_events TEXT,
      qr_url TEXT,
      blockchain_txid TEXT,
      blockchain_hash TEXT
    )
  `);
});

module.exports = db;
