const express = require("express");
const router = express.Router();
const controllers = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");
const {
  validateCreateUser,
  validateLogin,
  validateUpdateSubscription,
  validateResendEmail,
} = require("./validation");

router.get("/verify/:verificationToken", controllers.verify);
router.post(
  "/verify",
  validateResendEmail,
  controllers.resendEmailForVerification
);
router.post("/signup", validateCreateUser, controllers.signup);
router.post("/login", validateLogin, controllers.login);
router.post("/logout", guard, controllers.logout);
router.get("/current", guard, controllers.getCurrentUser);
router.patch(
  "/avatars",
  [guard, upload.single("avatarURL")],
  controllers.updateAvatar
);
router.patch(
  "/",
  [guard, validateUpdateSubscription],
  controllers.updateSubscription
);

module.exports = router;
