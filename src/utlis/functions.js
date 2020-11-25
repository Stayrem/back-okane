const bcrypt = require("bcrypt");
const { saltRounds } = require("./constants");

const createHash = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

module.exports = {
  createHash,
};
