const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  page: { type: String, default: '/' },
  userAgent: { type: String },
  ip: { type: String },
  referrer: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Visit', visitSchema);
