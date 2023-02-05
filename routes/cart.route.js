var express = require("express");
const {
  addToCart,
  removeFromCart,
  getCartItems,
  removeAllCart,
} = require("../services/cart.service");
var router = express.Router();

router.get("/", async (req, res) => {
  let username = req?.username;
  let response = await getCartItems({ username });
  res.json(response);
});

router.post("/:foodId", async (req, res) => {
  let { foodId } = req?.params;
  let username = req?.username;
  let response = await addToCart({ foodId, username });
  res.json(response);
});

router.delete("/removeAllCart", async (req, res) => {
  let body = req?.body;
  let username = req?.username;
  let response = await removeAllCart(body, { username });
  res.json(response);
});

router.delete("/:foodId", async (req, res) => {
  let { foodId } = req?.params;
  let username = req?.username;
  let response = await removeFromCart({ foodId, username });
  res.json(response);
});

module.exports = router;
