const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const qs = require("qs");
console.log("✅ paymentRoutes loaded");

router.get("/test", (req, res) => {
  res.send("payment route OK");
});

// function sortObject(obj) {
//   let sorted = {};
//   let str = [];
//   let key;

//   for (key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       str.push(encodeURIComponent(key));
//     }
//   }

//   str.sort();

//   for (key = 0; key < str.length; key++) {
//     sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
//   }

//   return sorted;
// }

router.post("/vnpay/create", async (req, res) => {
  const tmnCode = process.env.VNP_TMNCODE;
  const secretKey = process.env.VNP_HASHSECRET;
  const vnpUrl = process.env.VNP_URL;
  const returnUrl = process.env.VNP_RETURN_URL;
  

  const date = new Date();
  function formatDate(date) {
    const pad = (n) => n.toString().padStart(2, "0");

    return (
      date.getFullYear().toString() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds())
    );
  }

  const createDate = formatDate(new Date());

  const ipAddr =
  req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  '127.0.0.1';

  const orderId = Date.now();
  const amount = req.body.amount || 100000;

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Amount: amount * 100,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: "Thanh toan don hang",
    vnp_OrderType: "other",
    vnp_Locale: "vn",
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  // ⭐ BẮT BUỘC: sort trước
vnp_Params = Object.fromEntries(
  Object.entries(vnp_Params).sort(([a], [b]) => a.localeCompare(b))
);

  // ⭐ stringify KHÔNG encode khi hash
  const signData = qs.stringify(vnp_Params, { encode: false });
  console.log("signData =", signData);
  console.log("secretKey =", secretKey);
  console.log("ipAddr =", ipAddr);

  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  vnp_Params.vnp_SecureHash = signed;

  // ⭐ URL mới encode
  const paymentUrl = vnpUrl + "?" + qs.stringify(vnp_Params, { encode: true });

  res.json({ paymentUrl });
});

// ===== VNPAY RETURN =====
router.get("/vnpay/return", (req, res) => {
  let vnp_Params = { ...req.query };

  const secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const sortedParams = Object.fromEntries(
    Object.entries(vnp_Params).sort(([a], [b]) => a.localeCompare(b)),
  );

  const signData = qs.stringify(sortedParams, { encode: false }); // ⭐ QUAN TRỌNG
  const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    if (vnp_Params["vnp_ResponseCode"] === "00") {
      return res.send("✅ Thanh toán thành công (TEST)");
    } else {
      return res.send("❌ Thanh toán thất bại");
    }
  } else {
    return res.send("⚠️ Sai chữ ký");
  }
});

module.exports = router;
