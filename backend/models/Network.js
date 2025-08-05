const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  device_mac: String,
  device_vendor: String,
  device_type: String,
  probe_requests: [String],
});

const networkSchema = new mongoose.Schema({
  bssid: String,
  ssid: String,
  channel: Number,
  frequency: Number,
  signal_strength: Number,
  encryption: String,
  authentication: String,
  detected_at: { type: Date, default: Date.now },
  clients: [clientSchema],
});

module.exports = mongoose.model("Network", networkSchema);
