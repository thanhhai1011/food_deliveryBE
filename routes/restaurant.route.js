var express = require("express");
const {
  getAllRestaurant,
  getOneRestaurantById,
  addToRestaurant,
  getOneFoodRestaurantById,
  removeRestaurant,
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

router.post("/:restaurantToFoodId", async (req, res) => {
  let restaurantId = req?.params?.restaurantToFoodId;
  console.log('restaurantId: ', restaurantId);
  let response = await getOneFoodRestaurantById(restaurantId);
  res.json(response);
});

router.post("/", async (req, res) => {
  console.log('asda');
  let response = await getAllRestaurant();
  res.json(response);
});

router.post("/:restaurantId", async (req, res) => {
  let restaurantId = req?.params?.restaurantId;
  let response = await getOneRestaurantById(restaurantId);
  res.json(response);
});

router.delete("/delete/:restaurantId", async (req, res) => {
  let restaurantId  = req?.params?.restaurantId;
  let response = await removeRestaurant({ restaurantId });
  res.json(response);
});

module.exports = router;
