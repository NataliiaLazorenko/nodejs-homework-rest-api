const express = require("express");
const router = express.Router();
const controllers = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const {
  validateCreateUser,
  validateLogin,
  validateUpdateSubscription,
} = require("./validation");

router.post("/signup", validateCreateUser, controllers.signup);
router.post("/login", validateLogin, controllers.login);
router.post("/logout", guard, controllers.logout);
router.get("/current", guard, controllers.getCurrentUser);
router.patch(
  "/",
  guard,
  validateUpdateSubscription,
  controllers.updateSubscription
);

module.exports = router;
