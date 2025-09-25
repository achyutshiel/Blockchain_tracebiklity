// src/app.js
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

const collectionRoutes = require('./routes/collectionRoutes');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.use('/api/collections', collectionRoutes);

app.get('/', (req, res) => res.send('VrukshaChain Backend running'));

module.exports = app;
