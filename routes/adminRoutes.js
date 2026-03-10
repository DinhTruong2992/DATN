const express = require("express");
const router = express.Router();

router.get("/admin", (req, res) => {

  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("admin");

});
module.exports = router;