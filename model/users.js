const User = require("./schemas/user");

const getUserById = async (userId) => {
  return await User.findById(userId);
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (body) => {
  const user = new User(body);
  return await user.save();
};

const updateToken = async (userId, token) => {
  return await User.findByIdAndUpdate(userId, { token }, { new: true });
};

const updateUserSubscription = async (userId, body) => {
  return await User.findByIdAndUpdate(userId, { ...body }, { new: true });
};

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateToken,
  updateUserSubscription,
};
