require('dotenv').config();

const { SecretKey } = process.env;

const { NODE_ENV } = process.env;

const linTemplate = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

module.exports = {
  SecretKey,
  linTemplate,
  NODE_ENV,
};
