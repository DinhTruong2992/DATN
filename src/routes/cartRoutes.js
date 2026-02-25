const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// ================= GET CART =================
router.get("/", async (req, res) => {
  if (!req.session?.user) {
    return res.redirect("/login");
  }

  const cart = await Cart.findOne({
    user: req.session.user._id,
  }).populate("items.product");

  if (!cart) {
    return res.render("cart", { items: [], total: 0 });
  }

  let total = 0;
  cart.items.forEach(i => {
    if (i.product) {
      total += i.product.price * i.quantity;
    }
  });

  res.render("cart", { items: cart.items, total });
});

// ================= ADD TO CART =================
router.post("/add", async (req, res) => {
  try {
    if (!req.session?.user) {
      return res.json({ success: false, message: "Not logged in" });
    }

    const userId = req.session.user._id;
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: userId });

    // nếu chưa có cart → tạo mới
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity: 1 }]
      });
    } else {
      const index = cart.items.findIndex(
        i => i.product.toString() === productId
      );

      if (index > -1) {
        cart.items[index].quantity += 1;
      } else {
        cart.items.push({ product: productId, quantity: 1 });
      }

      await cart.save();
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

