const { default: mongoose } = require("mongoose");
const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");

const getOneFoodById = async (foodId) => {
  try {
    let food = await MongoDB.db
      .collection(mongoConfig.collections.FOODS)
      .findOne({ id: foodId });
    if (food) {
      return {
        status: true,
        message: "Food found successfully",
        data: food,
      };
    } else {
      return {
        status: false,
        message: "No Food found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Food finding failed",
      error: `Food finding failed : ${error?.message}`,
    };
  }
};

const addFoodById = async (food) => {
  let restaurantID = mongoose.Types.ObjectId(food?.restaurantId)
  try {
    if (!restaurantID)
      return { status: false, message: "Please fill up restaurant the fields" };
    let foodObject = {
      restaurantId: restaurantID,
      name: food?.name,
      price: food?.price,
      image: food?.image,
      category: food?.category,
      description: food?.description,
      ingredients: food?.ingredients
    };
    let saveFood = await MongoDB.db
      .collection(mongoConfig.collections.FOODS)
      .insertOne(foodObject);
    if (saveFood?.insertedId) {
      return {
        status: true,
        message: "Foods added successfully",
        data: foodObject,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Item Added to Foods Failed",
    };
  }
};

module.exports = { getOneFoodById, addFoodById };