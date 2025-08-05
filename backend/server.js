// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const networkRoutes = require("./routes/networkRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/networks", networkRoutes);

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/wifi_sniffer_simulation", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
  // server.js or routes file
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

