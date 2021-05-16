const Contact = require("./schemas/contact");

const listContacts = async () => {
  const contacts = await Contact.find({});
  return contacts;
};

const getContactById = async (contactId) => {
  const foundContact = await Contact.findById(contactId);
  return foundContact;
};

const addContact = async (body) => {
  const newContact = await Contact.create(body);
  return newContact;
};

const removeContact = async (contactId) => {
  const contactToRemove = await Contact.findByIdAndRemove(contactId);
  return contactToRemove;
};

const updateContact = async (contactId, body) => {
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { ...body },
    {
      new: true,
    }
  );
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
