const { ObjectId } = require("mongodb");
const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");

const addToBill = async (data, { username }) => {
  // let restaurantID = mongoose.Types.ObjectId(restaurantId)
  console.log('data', data);
  try {
    let insertBill = await MongoDB.db
      .collection(mongoConfig.collections.BILLS)
      .insertOne({ ...data, username });
    console.log('insertBill: ',insertBill);
    if (insertBill?.insertedId) {
      // let billResponse = await getBills({ username });
      return {
        status: true,
        message: "Bill added Successfully",
        // data: {
          ...data,
          id: insertBill?.insertedId
        // }
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Item Added to Bill Failed",
    };
  }
};

const getBills = async ({ username }) => {
  try {
    let bills = await MongoDB.db
      .collection(mongoConfig.collections.BILLS)
      .aggregate([
        {
          $match: {
            username: username,
          },
        },
        // {
        //   $lookup: {
        //     from: "restaurants",
        //     localField: "restaurantID",
        //     foreignField: "_id",
        //     as: "restaurant",
        //   },
        // },
        // {
        //   $unwind: {
        //     path: "$restaurant",
        //   },
        // },
      ])
      .toArray();
    if (bills?.length > 0) {
      return {
        status: "Success",
        message: "Bills fetched Successfully",
        data: bills,
      };
    } else {
      return {
        status: "Failed",
        message: "Bills not found",
      };
    }
  } catch (error) {
    return {
      status: "Failed",
      message: "Bills fetching Failed",
    };
  }
};

const getBillsPost = async () => {
  try {
    let bills = await MongoDB.db
      .collection(mongoConfig.collections.BILLS)
      .find()
      .toArray();

    if (bills && bills?.length > 0) {
      return {
        status: "Success",
        message: "Bills found successfully",
        data: bills,
      };
    } else {
      return {
        status: "Failed",
        message: "No bills found",
      };
    }
  } catch (error) {
    return {
      status: "Failed",
      message: "Bills finding failed",
      error: `Bills finding failed : ${error?.message}`,
    };
  }
};

module.exports = { addToBill, getBills, getBillsPost };
