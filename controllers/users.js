const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
  getUserByEmail,
  createUser,
  updateToken,
  updateUserSubscription,
} = require("../model/users");
const { HttpCode } = require("../helpers/constants");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

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
    const { id, email, subscription } = newUser;

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      user: {
        id,
        email,
        subscription,
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
      token: token,
      user: {
        email,
        subscription,
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

    const { email, subscription } = req.user;

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      user: {
        email,
        subscription,
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
        data: { email, subscription },
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

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
};
