var express = require("express");
const {
  getAllRestaurant,
  getOneRestaurantById,
  addToRestaurant,
} = require("../services/restaurant.service");
var router = express.Router();

router.get("/", async (req, res) => {
  let response = await getAllRestaurant();
  res.json(response);
});

router.get("/:restaurantId", async (req, res) => {
  let restaurantId = req?.params?.restaurantId;
  let response = await getOneRestaurantById(restaurantId);
  res.json(response);
});

router.post("/addRestaurantId", async (req, res) => {
  let body = req?.body;
  console.log('body: ', body);
  let response = await addToRestaurant(body);
  res.json(response);
});

module.exports = router;
