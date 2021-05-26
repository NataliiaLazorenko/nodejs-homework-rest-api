const Contact = require("./schemas/contact");

const getAllContacts = async (userId, query) => {
  const { limit = 20, page = 1, favorite = null } = query;
  const optionsSearch = { owner: userId };

  if (favorite !== null) {
    optionsSearch.favorite = favorite;
  }

  const results = await Contact.paginate(optionsSearch, { limit, page });

  const { docs: contacts, totalDocs: total } = results;

  return { contacts, total, limit, page };
};

const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, owner: userId });
};

const addContact = async (body) => {
  return await Contact.create(body);
};

const removeContact = async (contactId, userId) => {
  return await Contact.findOneAndRemove({ _id: contactId, owner: userId });
};

const updateContact = async (contactId, userId, body) => {
  return await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner: userId,
    },
    { ...body },
    { new: true }
  );
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
