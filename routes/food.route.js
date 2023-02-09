var express = require("express");
const { getOneFoodById, addFoodById, removeFood } = require("../services/food.service");
var router = express.Router();

router.get("/:foodId", async (req, res) => {
  let foodId = req?.params?.foodId;
  let response = await getOneFoodById(foodId);
  res.json(response);
});

router.post("/addFoodId", async (req, res) => {
  let body = req?.body;
  console.log('body: ', body);
  let response = await addFoodById(body);
  res.json(response);
});

router.post("/:foodId", async (req, res) => {
  let foodId = req?.params?.foodId;
  let response = await getOneFoodById(foodId);
  res.json(response);
});

router.delete("/deleteFood", async (req, res) => {
  let body  = req?.body;
  let response = await removeFood(body);
  res.json(response);
});

module.exports = router;