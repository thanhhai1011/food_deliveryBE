const { ObjectId } = require("mongodb");
const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");

const getAllRestaurant = async () => {
  try {
    let restaurants = await MongoDB.db
      .collection(mongoConfig.collections.RESTAURANTS)
      .find()
      .toArray();

    if (restaurants && restaurants?.length > 0) {
      return {
        status: true,
        message: "Restaurants found successfully",
        data: restaurants,
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

const getOneRestaurantById = async (restaurantId) => {
  try {
    let restaurant = await MongoDB.db
      .collection(mongoConfig.collections.RESTAURANTS)
      .aggregate([
        {
          $match: {
            _id: ObjectId(restaurantId)
          },
        },
        {
          $lookup: {
            from: "foods",
            localField: "id",
            foreignField: "restaurantId",
            as: "foods",
          },
        },
      ])
      .toArray()
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
    if (!restaurant?.name)
      return { status: false, message: "Please fill up all the fields" };
    let restaurantObject = {
      name: restaurant?.name,
      type: restaurant?.type,
      tags: restaurant?.tags,
      location: restaurant?.tags,
      distance: restaurant?.distance,
      time: restaurant?.time,
      categories: restaurant?.categories,
      images: restaurant?.images,
    };
    let saveRestaurant = await MongoDB.db
      .collection(mongoConfig.collections.RESTAURANTS)
      .insertOne(restaurantObject);
    saveRestaurant = {...saveRestaurant, insertedId: saveRestaurant?.insertedId.toString()}
    console.log('saveRestaurant', saveRestaurant);
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

module.exports = { getAllRestaurant, getOneRestaurantById, addToRestaurant };
