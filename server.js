const express = require("express");
const path = require("path");
const app = require("./src/app");
require("dotenv").config();

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Open: http://localhost:${PORT}`);
});
