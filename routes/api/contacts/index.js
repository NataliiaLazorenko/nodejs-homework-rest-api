const express = require("express");
const router = express.Router();
const {
  getAll,
  getById,
  create,
  remove,
  updateFields,
  updateStatusContact,
} = require("../../../controllers/contacts");
const {
  validateAddContact,
  validateUpdateContact,
  validateUpdateStatusContact,
  validateId,
} = require("./validation");

router.get("/", getAll);

router.get("/:contactId", validateId, getById);

router.post("/", validateId, validateAddContact, create);

router.delete("/:contactId", validateId, remove);

router.put("/:contactId", validateId, validateUpdateContact, updateFields);

router.patch(
  "/:contactId/favorite",
  validateId,
  validateUpdateStatusContact,
  updateStatusContact
);

module.exports = router;
