const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// ================= GET CART =================
router.get("/", async (req, res) => {
  if (!req.session?.user) {
    return res.redirect("/login");
  }

  const items = await Cart.find({
    user: req.session.user._id,
  }).populate("product").lean();

  let total = 0;
  items.forEach(i => {
    total += i.product.price * i.quantity;
  });

  res.render("cart", { items, total });
});

// ================= ADD TO CART =================
router.post("/add", async (req, res) => {
  try {
    if (!req.session?.user) {
      return res.json({ success: false, message: "Not logged in" });
    }

    const userId = req.session.user._id;
    const { productId } = req.body;

    let existing = await Cart.findOne({
      user: userId,
      product: productId
    });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
    } else {
      await Cart.create({
        user: userId,
        product: productId,
        quantity: 1
      });
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// ================= UPDATE QUANTITY =================
router.post("/update", async (req, res) => {
  try {
    const { cartId, change } = req.body;

    const item = await Cart.findById(cartId);
    if (!item) return res.json({ success: false });

    item.quantity += change;

    if (item.quantity <= 0) {
      await Cart.findByIdAndDelete(cartId);
    } else {
      await item.save();
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// ================= DELETE ITEM =================
router.post("/delete", async (req, res) => {
  try {
    const { cartId } = req.body;
    await Cart.findByIdAndDelete(cartId);
    res.json({ success: true });
  } catch {
    res.json({ success: false });
  }
});

module.exports = router;

