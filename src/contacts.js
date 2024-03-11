const fs = require("node:fs/promises");
const path = require("path");
const { randomBytes } = require("crypto");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

async function getContactById(id) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === id);
  return contact || null;
}

async function addContact(contactInfo) {
  const getAll = await listContacts();
  const randomId = randomBytes(16).toString("hex");
  const newContact = { id: randomId, ...contactInfo };
  getAll.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(getAll, null, 2));

  return newContact;
}

async function removeContact(id) {
  const getAll = await listContacts();
  const index = getAll.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const [result] = getAll.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(getAll, null, 2));
  return result;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
