const validator = require('validator');
const ErrorBadRequest = require('../errors/errorsbadrequest');

const validateURL = (value) => {
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

module.exports = {
  validateURL,
  validateEmail,
};
