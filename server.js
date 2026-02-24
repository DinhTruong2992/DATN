require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require("express");
const path = require("path");

const app = require("./src/app");

const PORT = process.env.PORT || 3002;

// Static folder
app.use(express.static(path.join(__dirname, "src/public")));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Open: http://localhost:${PORT}`);
});
