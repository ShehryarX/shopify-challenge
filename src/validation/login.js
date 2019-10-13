const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  // assign empty string instead of undefined
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  const { email, password } = data;

  // validate all fields
  if (!Validator.isEmail(email)) errors.email = "Email is invalid";
  if (Validator.isEmpty(email)) errors.email = "Email field is required";

  if (Validator.isEmpty(password))
    errors.password = "Password field is required";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
