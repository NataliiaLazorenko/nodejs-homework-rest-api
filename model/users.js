const User = require("./schemas/user");

const getUserById = async (userId) => {
  return await User.findById(userId);
};

const getUserByEmail = async (email) => {
  return await User.fondOne({ email });
};

const addUser = async (body) => {
  const user = new User(body);
  return await user.save();
};

const updateUser = async (userId, token) => {
  return await User.findByIdAndUpdate(userId, token, { new: true });
};

module.exports = { getUserById, getUserByEmail, addUser, updateUser };
