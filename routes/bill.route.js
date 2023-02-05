var express = require("express");
const { addToBill, getBills, getBillsPost } = require("../services/bill.service");
var router = express.Router();

router.get("/", async (req, res) => {
  let username = req?.username;
  console.log("abc");
  let response = await getBills({ username });
  res.json(response);
});

router.post("/getBill", async (req, res) => {
  let username = req?.username;
  console.log("abc");
  console.log('username', username);
  let response = await getBillsPost({ username });
  res.json(response);
});

// router.get("/:restaurantId", async (req, res) => {
//   let restaurantId = req?.params?.restaurantId;
//   let response = await getOneRestaurantById(restaurantId);
//   res.json(response);
// });

router.post("/addBill", async (req, res) => {
  let body = req?.body;
  let username = req?.username;
  console.log("body: ", body);
  let response = await addToBill(body, { username });
  res.json(response);
});

// router.post("/:restaurantId", async (req, res) => {
//   let { restaurantId } = req?.params;
//   let username = req?.username;
//   let response = await addBookmark({ restaurantId, username });
//   res.json(response);
// });

module.exports = router;
