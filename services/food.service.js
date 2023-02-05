const { default: mongoose } = require("mongoose");
const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");

const getOneFoodById = async (foodId) => {
  let foodID = mongoose.Types.ObjectId(foodId)
  console.log('foodID', foodID);
  try {
    let food = await MongoDB.db
      .collection(mongoConfig.collections.FOODS)
      .findOne({ _id: foodID });
    if (food) {
      return {
        status: "Success",
        message: "Food found successfully",
        data: food,
      };
    } else {
      return {
        status: "Failed",
        message: "No Food found",
      };
    }
  } catch (error) {
    return {
      status: "Failed",
      message: "Food finding failed",
      error: `Food finding failed : ${error?.message}`,
    };
  }
};

const addFoodById = async (food) => {
  let restaurantID = mongoose.Types.ObjectId(food?.restaurantId)
  try {
    if (!restaurantID)
      return { status: "Failed", message: "Please fill up restaurant the fields" };
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
        status: "Success",
        message: "Foods added successfully",
        data: foodObject,
      };
    }
  } catch (error) {
    return {
      status: "Failed",
      message: "Item Added to Foods Failed",
    };
  }
};

const getAllFood = async (restaurantId) => {
  let restaurantID = mongoose.Types.ObjectId(restaurantId)
  console.log('restaurantID', restaurantID);
  try {
    let food = await MongoDB.db
      .collection(mongoConfig.collections.FOODS)
      .find({ _id: restaurantID });
    if (food) {
      return {
        status: "Success",
        message: "Food All found successfully",
        data: food,
      };
    } else {
      return {
        status: "Failed",
        message: "No Food All found",
      };
    }
  } catch (error) {
    return {
      status: "Failed",
      message: "Food finding failed",
      error: `Food finding failed : ${error?.message}`,
    };
  }
};

module.exports = { getOneFoodById, addFoodById, getAllFood };