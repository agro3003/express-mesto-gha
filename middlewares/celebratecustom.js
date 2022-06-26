const validator = require('validator');
const ErrorBadRequest = require('../errors/errorsbadrequest');

const regExpURL = /^https?:\/\/(www\.)?[-\w:%\.\+~#=]{1,256}\.[a-z0-9()]{1,6}([-\w()@:%\.\+~#=//?&]*)/;

const validateURL1 = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new ErrorBadRequest('Неправильный формат ссылки');
  }
  return value;
};

const validateEmail = (value) => {
  if (!validator.isEmail(value, { require_protocol: true })) {
    throw new ErrorBadRequest('Неправильный формат email');
  }
  return value;
};
const validateURL = (value) => {
  if (!value.match(regExpURL)) {
    throw new ErrorBadRequest('Неправильный формат ссылки');
  }
  return value;
};

module.exports = {
  validateURL,
  validateURL1,
  validateEmail,
};
