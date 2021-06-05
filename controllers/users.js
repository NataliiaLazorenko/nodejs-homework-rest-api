const jwt = require("jsonwebtoken");
require("dotenv").config();

// =============== upload avatars to cloud ===============
// const cloudinary = require("cloudinary").v2;
// const { promisify } = require("util"); // allows to avoid callback and work with promises

const {
  getUserByEmail,
  createUser,
  updateToken,
  updateUserSubscription,
  updateUserAvatar,
} = require("../repository/users");

const { HttpCode } = require("../helpers/constants");

const UploadAvatar = require("../services/upload-avatars-local"); // upload avatars local
// const UploadAvatar = require("../services/upload-avatars-to-cloud"); // upload avatars to cloud

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// =============== upload avatars local ===============
const PUBLIC_DIR = process.env.PUBLIC_DIR;
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;

// =============== upload avatars to cloud ===============
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

const signup = async (req, res, next) => {
  try {
    const user = await getUserByEmail(req.body.email);

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email is already in use",
      });
    }

    const newUser = await createUser(req.body);
    const { id, email, subscription, avatarURL } = newUser;

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        user: {
          id,
          email,
          subscription,
          avatarURL,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    const isPasswordValid = await user?.validPassword(password);

    if (!user || !isPasswordValid) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Invalid crendentials",
      });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "3h" });

    await updateToken(user.id, token);

    const subscription = user.subscription;

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        token: token,
        user: {
          email,
          subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await updateToken(userId, null);

    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }

    const { email, subscription, avatarURL } = req.user;

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        user: {
          email,
          subscription,
          avatarURL,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    if (!req.body.subscription) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: "error",
        code: HttpCode.BAD_REQUEST,
        message: "missing field subscription",
      });
    }

    const userId = req.user.id;
    const updatedContact = await updateUserSubscription(userId, req.body);

    const { email, subscription } = req.user;

    if (updatedContact) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: { user: { email, subscription } },
      });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // =============== upload avatars local ===============
    const uploads = new UploadAvatar(PUBLIC_DIR, AVATARS_OF_USERS);

    const avatarUrl = await uploads.saveAvatarToStatic({
      userId,
      pathFile: req.file.path,
      name: req.file.filename,
      oldFile: req.user.avatarURL,
    });

    await updateUserAvatar(userId, avatarUrl);

    // =============== upload avatars to cloud ===============
    // const uploadCloud = promisify(cloudinary.uploader.upload);

    // const uploads = new UploadAvatar(uploadCloud);
    // const { avatarId, avatarUrl } = await uploads.saveAvatarToCloud(
    //   req.file.path,
    //   req.user.avatarId
    // );

    // await updateUserAvatar(userId, avatarUrl, avatarId);

    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: { avatarURL: avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
};
