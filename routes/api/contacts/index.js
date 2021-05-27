const express = require("express");
const router = express.Router();
const controllers = require("../../../controllers/contacts");
const guard = require("../../../helpers/guard");
const {
  validateAddContact,
  validateUpdateContact,
  validateUpdateStatusContact,
  validateId,
} = require("./validation");

router.get("/", guard, controllers.getAll);
router.get("/:contactId", guard, validateId, controllers.getById);
router.post("/", guard, validateId, validateAddContact, controllers.create);
router.delete("/:contactId", guard, validateId, controllers.remove);

router.put(
  "/:contactId",
  guard,
  validateId,
  validateUpdateContact,
  controllers.updateFields
);

router.patch(
  "/:contactId/favorite",
  guard,
  validateId,
  validateUpdateStatusContact,
  controllers.updateStatusContact
);

module.exports = router;
