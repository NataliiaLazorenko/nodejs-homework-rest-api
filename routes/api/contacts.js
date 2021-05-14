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
  validateUpdateContactPhone,
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

router.get("/:contactId", async (req, res, next) => {
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

router.post("/", validateAddContact, async (req, res, next) => {
  try {
    // const { name, phone } = req.body;

    // if (!name || !phone) {
    //   return res.status(400).json({
    //     status: "error",
    //     code: 400,
    //     message: "missing required name field",
    //   });
    // }

    const newContact = await addContact(req.body);

    return res
      .status(201)
      .json({ status: "success", code: 201, data: { newContact } });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
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

router.put("/:contactId", validateUpdateContact, async (req, res, next) => {
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
});

router.patch(
  "/:contactId/phone",
  validateUpdateContactPhone,
  async (req, res, next) => {
    try {
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
