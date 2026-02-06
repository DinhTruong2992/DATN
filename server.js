const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/payments", (req, res) => {
  res.render("payment");
});

app.listen(3000, () => {
  console.log("Server running");
});
