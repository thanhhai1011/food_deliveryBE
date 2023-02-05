const { default: mongoose } = require("mongoose");
const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");

const addToCart = async ({ foodId, username }) => {
  // console.log('food?.foodId ', foodId);
  let foodID = mongoose.Types.ObjectId(foodId);
  try {
    let updateCart = await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .updateOne(
        { foodID, username },
        { $inc: { quantity: 1 } },
        { upsert: true }
      );
    if (updateCart?.modifiedCount > 0 || updateCart?.upsertedCount > 0) {
      let cartResponse = await getCartItems({ username });
      return {
        status: "Success",
        message: "Item Added to Cart Sucessfully",
        data: cartResponse?.data,
      };
    }
  } catch (error) {
    return {
      status: "Failed",
      message: "Item Added to Cart Failed",
      error: error,
    };
  }
};

const removeFromCart = async ({ foodId, username }) => {
  let foodID = mongoose.Types.ObjectId(foodId);
  try {
    let cart = await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .findOne({ foodID, username, quantity: 1 });
    if (cart) {
      await MongoDB.db
        .collection(mongoConfig.collections.CARTS)
        .deleteOne({ foodID, username });
      let cartResponse = await getCartItems({ username });
      return {
        status: "Success",
        message: "Item Removed from Cart Successfully",
        data: cartResponse?.data,
      };
    }
    let updatedCart = await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .updateOne(
        { foodID, username },
        { $inc: { quantity: -1 } },
        { upsert: true }
      );
    if (updatedCart?.modifiedCount > 0 || updatedCart?.upsertedCount > 0) {
      let cartResponse = await getCartItems({ username });
      return {
        status: "Success",
        message: "Item Removed from Cart Successfully",
        data: cartResponse?.data,
      };
    }
  } catch (error) {
    return {
      status: "Failed",
      message: "Item Removed from Cart Failed",
    };
  }
};

const removeAllCart = async (cart, {username}) => {
  cart
  try {
    await MongoDB.db.collection(mongoConfig.collections.CARTS).deleteMany({"username" : username})
    return {
      status: "Success",
      message: "Item Removed All Cart Successfully",
    };
  } catch (error) {
    return {
      status: "Failed",
      message: "Item Removed All Cart Failed",
    };
  }
};

const getCartItems = async ({ username }) => {
  try {
    let cartItems = await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .aggregate([
        {
          $match: {
            username: username,
          },
        },
        {
          $lookup: {
            from: "foods",
            localField: "foodID",
            foreignField: "_id",
            as: "food",
          },
        },
        {
          $unwind: {
            path: "$food",
          },
        },
      ])
      .toArray();
    if (cartItems?.length > 0) {
      let itemsTotal = cartItems
        ?.map((cartItem) => cartItem?.food?.price * cartItem?.quantity)
        ?.reduce((a, b) => parseFloat(a) + parseFloat(b));
      let discount = 0;
      return {
        status: "Success",
        message: "Cart items fetched Successfully",
        data: {
          cartItems,
          // metaData: {
          //   itemsTotal,
          //   discount,
          //   grandTotal: itemsTotal - discount,
          // },
          itemsTotal,
          discount,
          grandTotal: itemsTotal - discount
        },
      };
    } else {
      return {
        status: "Failed",
        message: "Cart items not found",
      };
    }
  } catch (error) {
    return {
      status: "Failed",
      message: "Cart items fetched Failed",
    };
  }
};

module.exports = { addToCart, removeFromCart, getCartItems, removeAllCart };
