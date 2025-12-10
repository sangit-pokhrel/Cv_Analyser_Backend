const validator = require('validator');

function validateRegister({ email, password }) {
  const errors = [];
  if (!email || !validator.isEmail(email)) errors.push('Valid email required');
  if (!password || password.length < 8) errors.push('Password must be at least 8 characters');
  // add more constraints (upper/lower/numbers/symbols) if desired
  return errors;
}

module.exports = {
  validateRegister
};
 