const { ObjectId } = require("mongodb");
const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");
const { default: mongoose } = require("mongoose");

const getAllRestaurant = async () => {
  try {
    let restaurants = await MongoDB.db
      .collection(mongoConfig.collections.RESTAURANTS)
      .find()
      .toArray();

    if (restaurants && restaurants?.length > 0) {
      return {
        status: "Success",
        message: "Restaurants found successfully",
        data: restaurants,
      };
    } else {
      return {
        status: "Failed",
        message: "No restaurants found",
      };
    }
  } catch (error) {
    return {
      status: "Failed",
      message: "Restaurants finding failed",
      error: `Restaurants finding failed : ${error?.message}`,
    };
  }
};

const getOneRestaurantById = async (restaurantId) => {
  try {
    let restaurant = await MongoDB.db
      .collection(mongoConfig.collections.RESTAURANTS)
      .aggregate([
        {
          $match: {
            _id: ObjectId(restaurantId),
          },
        },
        {
          $lookup: {
            from: "foods",
            localField: "_id",
            foreignField: "restaurantId",
            as: "foods",
          },
        },
      ])
      .toArray();
    if (restaurant && restaurant?.length > 0) {
      return {
        status: true,
        message: "Restaurants found successfully",
        data: restaurant[0],
      };
    } else {
      return {
        status: false,
        message: "No restaurants found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Restaurants finding failed",
      error: `Restaurants finding failed : ${error?.message}`,
    };
  }
};

const addToRestaurant = async (restaurant) => {
  try {
    // if (!restaurant?.name)
    //   return { status: false, message: "Please fill up all the fields" };
    let restaurantObject = {
      name: restaurant?.name,
      type: restaurant?.type,
      tags: restaurant?.tags,
      location: restaurant?.location,
      distance: restaurant?.distance,
      time: restaurant?.time,
      categories: restaurant?.categories,
      images: restaurant?.images,
    };
    let saveRestaurant = await MongoDB.db
      .collection(mongoConfig.collections.RESTAURANTS)
      .insertOne(restaurantObject);
    saveRestaurant = {
      ...saveRestaurant,
      insertedId: saveRestaurant?.insertedId.toString(),
    };
    console.log("saveRestaurant", saveRestaurant);
    if (saveRestaurant?.insertedId) {
      let restaurantResponse = await getAllRestaurant();
      return {
        status: true,
        message: "Restaurant added successfully",
        data: restaurantResponse?.data,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Item Added to Restaurant Failed",
    };
  }
};

const getOneFoodRestaurantById = async (restaurantId) => {
  console.log('restaurantId getOneFoodRestaurantById: ', restaurantId);
  try {
    let restaurant = await MongoDB.db
      .collection(mongoConfig.collections.RESTAURANTS)
      .aggregate([
        {
          $match: {
            _id: ObjectId(restaurantId),
          },
        },
        {
          $lookup: {
            from: "foods",
            localField: "_id",
            foreignField: "restaurantId",
            as: "foods",
          },
        },
      ])
      .toArray();
    console.log("restaurant 1: ", restaurant);
    if (restaurant && restaurant?.length > 0) {
      return {
        status: true,
        message: "Restaurants found successfully 1 ",
        data: restaurant[0]?.foods,
      };
    } else {
      return {
        status: false,
        message: "No restaurants found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Restaurants finding failed",
      error: `Restaurants finding failed : ${error?.message}`,
    };
  }
};

const removeRestaurant = async ({ restaurantId }) => {
  try {
    let removedRestaurant = await MongoDB.db
      .collection(mongoConfig.collections.RESTAURANTS)
      .deleteOne({ "_id": ObjectId(restaurantId) });
    if (removedRestaurant?.deletedCount > 0) {
      let restaurantResponse = await getAllRestaurant();
      return {
        status: true,
        message: "Restaurant Removed Successfully",
        data: restaurantResponse?.data
      };
    } else {
      return {
        status: false,
        message: 'Restaurant Removed Failed'
      }
    }
  } catch (error) {
    return {
      status: false,
      message: "Restaurant Removed Failed",
    };
  }
};

module.exports = {
  getAllRestaurant,
  getOneRestaurantById,
  addToRestaurant,
  getOneFoodRestaurantById,
  removeRestaurant
};
