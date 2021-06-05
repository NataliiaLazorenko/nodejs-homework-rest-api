const {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../repository/contacts");
const { HttpCode } = require("../helpers/constants");

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { contacts, total, limit, page } = await getAllContacts(
      userId,
      req.query
    );

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: { contacts, total, limit, page },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;

    const contact = await getContactById(contactId, userId);

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

    const userId = req.user.id;

    const newContact = await addContact({ ...req.body, owner: userId });

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: { newContact },
    });
  } catch (error) {
    // if (error.message.includes("duplicate key error")) {
    //   error.status = HttpCode.BAD_REQUEST;
    //   error.message = "email should be unique";
    // }

    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;

    const contact = await removeContact(contactId, userId);

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

    const userId = req.user.id;
    const { contactId } = req.params;

    const updatedContact = await updateContact(contactId, userId, req.body);

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

    const userId = req.user.id;
    const { contactId } = req.params;

    const updatedContact = await updateContact(contactId, userId, req.body);

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
