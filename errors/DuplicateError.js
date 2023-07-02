module.exports = class DuplicateError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
};
