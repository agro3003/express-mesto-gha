const jwt = require('jsonwebtoken');
const ErrorAuth = require('../errors/errorauth');

const { NODE_ENV, JWT_SECRET } = process.env;

const extractBearerToken = (header) => header.replace('Bearer ', '');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) throw new ErrorAuth('Необходима авторизация');

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    next(new ErrorAuth('Необходима авторизация'));
  }
  req.user = payload;

  next();
};

module.exports = {
  auth,
};
