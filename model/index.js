const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const foundContact = contacts.find(
    (contact) => contact.id.toString() === contactId
  );
  return foundContact;
};

const addContact = async (body) => {
  const contacts = await listContacts();

  const id = uuidv4();
  const newContact = { id, ...body };
  const newContactsList = [...contacts, newContact];

  await fs.writeFile(contactsPath, JSON.stringify(newContactsList, null, "\t"));

  return newContact;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contactToRemove = contacts.find(
    ({ id }) => id.toString() === contactId
  );

  if (!contactToRemove) {
    return;
  }

  const filteredContacts = contacts.filter(
    ({ id }) => id.toString() !== contactId
  );

  const updatedContactsList = JSON.stringify(filteredContacts, null, "\t");
  await fs.writeFile(contactsPath, updatedContactsList);

  return contactToRemove;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const contactToUpdate = contacts.find(
    ({ id }) => id.toString() === contactId
  );

  if (!contactToUpdate) {
    return;
  }

  const updatedContact = { ...contactToUpdate, ...body };
  const updatedContactsList = contacts.map((contact) =>
    contact.id.toString() === contactId ? updatedContact : contact
  );

  await fs.writeFile(
    contactsPath,
    JSON.stringify(updatedContactsList, null, "\t")
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
