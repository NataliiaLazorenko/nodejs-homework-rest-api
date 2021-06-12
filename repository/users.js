const User = require("../schemas/user");

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

// upload avatars local
const updateUserAvatar = async (userId, avatarURL) => {
  return await User.findByIdAndUpdate(userId, { avatarURL });
};

// upload avatars to cloud
// const updateUserAvatar = async (userId, avatarURL, avatarId = null) => {
//   return await User.findByIdAndUpdate(userId, { avatarURL, avatarId });
// };

const getUserByVerificationToken = async (verificationToken) => {
  return await User.findOne({ verificationToken });
};

const updateVerifyToken = async (userId, isVerified, verificationToken) => {
  return await User.findByIdAndUpdate(userId, {
    isVerified,
    verificationToken,
  });
};

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateToken,
  updateUserSubscription,
  updateUserAvatar,
  getUserByVerificationToken,
  updateVerifyToken,
};
