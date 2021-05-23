const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../model/index");
const { HttpCode } = require("../helpers/constants");

const getAll = async (_req, res, next) => {
  try {
    const contacts = await listContacts();

    return res
      .status(HttpCode.OK)
      .json({ status: "success", code: HttpCode.OK, data: { contacts } });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: "success", code: HttpCode.OK, data: { contact } });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Not Found",
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    // const { name, email } = req.body;

    // if (!name || !email) {
    //   return res.status(HttpCode.BAD_REQUEST).json({
    //     status: "error",
    //     code: HttpCode.BAD_REQUEST,
    //     message: "missing required name field",
    //   });
    // }

    if (!req.body.favorite) {
      req.body.favorite = false;
    }

    const newContact = await addContact(req.body);

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: { newContact },
    });
  } catch (error) {
    if (error.message.includes("duplicate key error")) {
      error.status = HttpCode.BAD_REQUEST;
      error.message = "email should be unique";
    }

    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);

    if (contact) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        message: "contact deleted",
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

const updateFields = async (req, res, next) => {
  try {
    // const fieldsToUpdate = Object.keys(req.body);

    // if (fieldsToUpdate.length === 0) {
    //   return res.status(HttpCode.BAD_REQUEST).json({
    //     status: "error",
    //     code: HttpCode.BAD_REQUEST,
    //     message: "missing fields",
    //   });
    // }

    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId, req.body);

    if (updatedContact) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: { updatedContact },
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

const updateStatusContact = async (req, res, next) => {
  try {
    if (!req.body.favorite) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: "error",
        code: HttpCode.BAD_REQUEST,
        message: "missing field favorite",
      });
    }

    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId, req.body);

    if (updatedContact) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: { updatedContact },
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
  getAll,
  getById,
  create,
  remove,
  updateFields,
  updateStatusContact,
};
