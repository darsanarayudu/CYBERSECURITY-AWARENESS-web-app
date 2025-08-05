const express = require("express");
const router = express.Router();
const Network = require("../models/Network");

// GET all networks
router.get("/", async (req, res) => {
  const networks = await Network.find().sort({ detected_at: -1 });
  res.json(networks);
});

// POST a new network
router.post("/", async (req, res) => {
  try {
    const newNetwork = new Network(req.body);
    const saved = await newNetwork.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
