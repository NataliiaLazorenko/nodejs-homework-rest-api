const express = require("express");
const router = express.Router();
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../model/index");
const {
  validateAddContact,
  validateUpdateContact,
  validateUpdateStatusContact,
  validateId,
} = require("./validation");

router.get("/", async (_req, res, next) => {
  try {
    const contacts = await listContacts();

    return res
      .status(200)
      .json({ status: "success", code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", validateId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not Found" });
  } catch (error) {
    next(error);
  }
});

router.post("/", validateId, validateAddContact, async (req, res, next) => {
  try {
    // const { name, email } = req.body;

    // if (!name || !email) {
    //   return res.status(400).json({
    //     status: "error",
    //     code: 400,
    //     message: "missing required name field",
    //   });
    // }

    if (!req.body.favorite) {
      req.body.favorite = false;
    }

    const newContact = await addContact(req.body);

    return res
      .status(201)
      .json({ status: "success", code: 201, data: { newContact } });
  } catch (error) {
    if (error.message.includes("duplicate key error")) {
      error.status = 400;
      error.message = "email should be unique";
    }

    next(error);
  }
});

router.delete("/:contactId", validateId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);

    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, message: "contact deleted" });
    }

    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found" });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:contactId",
  validateId,
  validateUpdateContact,
  async (req, res, next) => {
    try {
      // const fieldsToUpdate = Object.keys(req.body);

      // if (fieldsToUpdate.length === 0) {
      //   return res.status(400).json({
      //     status: "error",
      //     code: 400,
      //     message: "missing fields",
      //   });
      // }

      const { contactId } = req.params;
      const updatedContact = await updateContact(contactId, req.body);

      if (updatedContact) {
        return res
          .status(200)
          .json({ status: "success", code: 200, data: { updatedContact } });
      }

      return res
        .status(404)
        .json({ status: "error", code: 404, message: "Not found" });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:contactId/favorite",
  validateId,
  validateUpdateStatusContact,
  async (req, res, next) => {
    try {
      if (!req.body.favorite) {
        return res.status(400).json({
          status: "error",
          code: 400,
          message: "missing field favorite",
        });
      }

      const { contactId } = req.params;
      const updatedContact = await updateContact(contactId, req.body);

      if (updatedContact) {
        return res
          .status(200)
          .json({ status: "success", code: 200, data: { updatedContact } });
      }

      return res
        .status(404)
        .json({ status: "error", code: 404, message: "Not found" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
