const jwt = require('jsonwebtoken');
const { SecretKey } = require('../utils/constants');
const AuthError = require('../errors/AuthError');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  const errorMessage = 'Неправильные почта или пароль';
  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new AuthError(`${errorMessage}(${authorization})!`));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, SecretKey);
  } catch (err) {
    return next(new AuthError(`${errorMessage}!`));
  }
  req.user = payload;
  return next();
};
