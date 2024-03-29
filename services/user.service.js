const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");

const getUserData = async (username) => {
  try {
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .findOne({ username });

    if (userObject) {
      return {
        status: "Success",
        message: "User found successfully",
        data: userObject,
      };
    } else {
      return {
        status: "Failed",
        message: "No user found",
      };
    }
  } catch (error) {
    return {
      status: "Failed",
      message: "User finding failed",
      error: `User finding failed : ${error?.message}`,
    };
  }
};

module.exports = { getUserData };